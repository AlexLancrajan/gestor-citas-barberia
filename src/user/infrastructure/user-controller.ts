import { DeleteUser } from "../application/delete-user";
import { FindUser } from "../application/find-user";
import { RegisterUser } from "../application/register-user";
import { Roles, UserForToken, UserRegModFields } from "../domain/user";
import options from "../../ztools/config";
import { ModifyUser } from "../application/modify-user";

import { Request, Response } from "express";
import { omit } from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserLoginSchema, UserModificationsSchema, UserRegistrationSchema } from "./user-schema";

/**
 * It defines all the router functionalities.
 */
export class UserController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly findUser: FindUser,
    private readonly deleteUser: DeleteUser,
    private readonly modifyUser: ModifyUser
  ) { }

  async registerUserFunction(req: Request, res: Response) {
    const body: UserRegistrationSchema = req.body as UserRegistrationSchema;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const noPassBody: Omit<UserRegistrationSchema, 'password'> = 
    omit(body, 'password');

    const newUser: UserRegModFields = 
    {passwordHash: passwordHash, ...noPassBody};

    try {
      const registeredUser = await this.registerUser.run(newUser);
      return res.json(registeredUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  }

  async loginUserFunction(req: Request, res: Response) {
    try {
      const body = req.body as UserLoginSchema;
      const user = await this.findUser.runFindUser(body.username);

      const passwordCorrect = 
      await bcrypt.compare(body.password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        return res.status(400)
          .json({ error: 'Incorrect password or username.' });
      } else {
        const userForToken = {
          userId: user.userId,
          username: user.username,
          role: user.role,
          missingTrack: user.missingTrack
        };
  
        const ACCESS_TOKEN = jwt.sign(userForToken, options.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
        const REFRESH_TOKEN = jwt.sign(userForToken, options.REFRESH_TOKEN_SECRET, { expiresIn: '5h' });
  
        return res
        .header('authorization', ACCESS_TOKEN)
        .cookie('refresh', REFRESH_TOKEN, {
          httpOnly: true,
          sameSite: process.env.NODE_ENV ? 'none' : 'strict', 
          secure: process.env.NODE_ENV ? false : true,
          maxAge: 24 * 60 * 60 * 1000
        }).json({ status: 'user logged', role: user.role, accessToken: ACCESS_TOKEN });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  }

  refreshUserFunctionality(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh'] as string;
    if(!refreshToken)
      return res.status(401).json({ error: 'Unauthorized access. No refresh token provided'});

    try {
      const decodedToken: UserForToken = jwt.verify(refreshToken, options.REFRESH_TOKEN_SECRET) as UserForToken;
      const { userId, username, role, missingTrack } = decodedToken;
      const accessToken = jwt.sign(
        { userId: userId, 
          username: username,
          role: role,
          missingTrack: missingTrack 
        }, 
        options.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '5m'
        }
      );
      return res
        .header('authorization', accessToken)
        .json({ message: 'access token refreshed'});
    } catch(_error: unknown) {
      return res.status(400).json({ error: 'Invalid refresh token.'});
    }
  }

  async findUserFunction(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.userToken?.userId;
    const role = req.userToken?.role.toString().toLowerCase();
 
    if (userId !== id && 
        role !== Roles.admin.toString()) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    try {
      const user = await this.findUser.runFindUserId(id);
      return res.json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  }

  async findAllUsersFunction(req: Request, res: Response) {
    if (req.userToken?.role.toString().toLowerCase() !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }
    const qRole = req.query.role?.toString().toLowerCase();
    const params = {
      role: Object.values(Roles).find(role => role === qRole) || undefined,
      missingTrack: Number(req.query.missingTrack) || 0,
      page: Number(req.query.page) || 0,
      pageSize: Number(req.query.pageSize) || 50,
    };

    try {
      if(params.role){
        const users = 
        await this.findUser.runFindUsersByRole(
          params.role,
          params.page,
          params.pageSize,
        );
        return res.json(users);

      } else if(params.missingTrack) {
        const users = await this.findUser.runFindUsersByMissingTrack(
          params.missingTrack,
          params.page,
          params.pageSize,
        );
        return res.json(users);
      } else {
        const users = await this.findUser.runFindUsers(
          params.page,
          params.pageSize,
        );
        return res.json(users);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  }

  async deleteUserFunction(req: Request, res: Response) {
    const id = req.params.id;
    const pRole = req.userToken?.role.toString().toLowerCase();
    const role = Object.values(Roles).find(role => role.toString() === pRole);

    if (req.userToken?.userId !== id && 
      role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }
    try {
      await this.deleteUser.run(id);
      return res.status(204).json({ deletedUser: 'true' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(204).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  }

  async modifyUserFunction(req: Request, res: Response) {
    const id = req.params.id;
    const pRole = req.userToken?.role.toString().toLowerCase();
    const role = Object.values(Roles).find(role => role.toString() === pRole);
    const body = req.body as UserModificationsSchema;

    if (req.userToken?.userId !== id &&
        role !== Roles.admin
      ) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const saltRounds = 10;
    const modifiedUser: UserModificationsSchema = {
      ...body,
      ...(body.password && { passwordHash: await bcrypt.hash(body.password, saltRounds) })
    };
    
    try {
      const changedUser = await this.modifyUser.run(id, modifiedUser);
      return res.json(changedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'internal server error ' });
      }
    }
  }

}
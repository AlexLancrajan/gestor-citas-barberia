import { DeleteUser } from "../application/delete-user";
import { FindUser } from "../application/find-user";
import { RegisterUser } from "../application/register-user";
import { UserFieldsNoId, UserNoId, UserForToken } from "../domain/user";
import { UserRegistrationSchema, UserLoginSchema, UserModificationSchema } from "./user-schema";
import options from "../../config";
import { ModifyUser } from "../application/modify-user";

import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { OAuth2Client } from "google-auth-library";




export class UserController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly findUser: FindUser,
    private readonly deleteUser: DeleteUser,
    private readonly modifyUser: ModifyUser
  ) { }

  async registerUserFunction(req: Request, res: Response) {
    const body = req.body as UserRegistrationSchema;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const newUser: UserFieldsNoId = {
      passwordHash: passwordHash,
      username: body.username,
      email: body.email,
      phone: body.phone,
      role: body.role,
      name: body.name,
      surname: body.surname
    };
    const user = new UserNoId(newUser);

    try {
      const registeredUser = await this.registerUser.run(user);
      res.json(registeredUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'internal server error' });
    }
  }

  async loginUserFunction(req: Request, res: Response) {
    const body = req.body as UserLoginSchema;
    let user;
    try {
      user = await this.findUser.runFindUser(body.username);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }

    const passwordCorrect = await bcrypt.compare(body.password, user.userFields.passwordHash);

    if (!(user && passwordCorrect)) {
      throw new Error('Incorrect password... Try again.');
    } else {
      const userForToken = {
        username: user.userFields.username,
        userId: user.userFields.userId,
        role: user.userFields.role
      };

      const userForRefresh = {
        username: user.userFields.username
      };

      const ACCESS_TOKEN = jwt.sign(userForToken, options.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: '20s' });
      const REFRESH_TOKEN = jwt.sign(userForRefresh, options.REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn: '1h' });

      res.cookie('jwt', REFRESH_TOKEN, {
        httpOnly: true,
        sameSite: 'none', secure: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.json(ACCESS_TOKEN);
    }
  }

  refreshTokenFunction(req: Request, res: Response) {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (req.cookies?.jwt) {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const REFRESH_TOKEN = req.cookies.jwt as string;

      jwt.verify(REFRESH_TOKEN, options.REFRESH_TOKEN_SECRET as jwt.Secret,
        (err: unknown) => {
          if (err instanceof Error) {
            return res.status(401).json({ message: 'Unauthorized' });
          } else {
            const body = req.body as UserForToken;
            const ACCESS_TOKEN = jwt.sign({
              username: body.username,
              userId: body.userId,
              role: body.role
            }, options.ACCESS_TOKEN_SECRET as jwt.Secret, {
              expiresIn: '20s'
            });
            return res.json({ ACCESS_TOKEN });
          }
        });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return;
  }

  async findUserFunction(req: Request, res: Response) {
    const id = req.params.id;
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.userId !== id || decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    let user;
    try {
      user = await this.findUser.runFindUserId(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }

    return res.json(user);
  }

  async findAllUsersFunction(req: Request, res: Response) {
    const decodedToken: UserForToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    let users;
    try {
      users = await this.findUser.runFindUsers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }

    return res.json(users);
  }

  async deleteUserFunction(req: Request, res: Response) {
    const id = req.params.id;
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.userId !== id || decodedToken.role !== 'admin') {
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
    const decodedToken: UserForToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    const body = req.body as UserModificationSchema;

    if (decodedToken.userId !== id) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    let passwordHash;
    let modifiedUser: Partial<UserFieldsNoId>;
    if (body.password) {
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(body.password, saltRounds);

      modifiedUser = {
        passwordHash: passwordHash,
        username: body.username,
        email: body.email,
        phone: body.phone,
        role: body.role,
        name: body.name,
        surname: body.surname
      };
    } else {
      modifiedUser = {
        username: body.username,
        email: body.email,
        phone: body.phone,
        role: body.role,
        name: body.name,
        surname: body.surname
      };
    }

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

  // async googleSignUpFunction(req: Request, res: Response) {
  //   const client = new OAuth2Client();
  //   const token = req.body['id_token'];
  //   async function verify() {
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: CLIENT_ID,
  //     });
  //     const payload = ticket.getPayload();
  //     if (!payload) {
  //       throw new Error('No valid payload found.');
  //     }
  //     const userId = payload['sub'];
  //   }

  //   verify().catch(console.error);
  // }
}
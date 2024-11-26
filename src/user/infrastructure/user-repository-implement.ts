/**
 * Implmenentation of User Repository based on sequelize library. 
 * For the definitions of the supported operations see user-repository.ts
 */

import { mySQLUser } from "../../mySQL";
import { UserRegModFields, Roles, UserNoHashField, UserFields } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

export class mySQLUserRepository implements UserRepository {

  async getById(userId: string): Promise<UserNoHashField | null> {
    const collectedUser = await 
    mySQLUser.findByPk(
      userId, 
      { 
        attributes: { 
          exclude: ['passwordHash', 'createdAt', 'updatedAt'] 
        } 
      }
    );

    if (collectedUser) {
      const userNoHash: UserNoHashField = collectedUser.toJSON();
      return userNoHash;
    } else {
      return null;
    }
  }

  async getByUsername(username: string): Promise<UserFields | null> {
    const collectedUser = await 
    mySQLUser.findOne(
      { 
        where: { 
          username: username 
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        } 
      }
    );

    if (collectedUser) {
      const user: UserFields = collectedUser.toJSON();
      return user;
    } else {
      return null;
    }
  }

  async getByRole(
    role: Roles, 
    page: number, 
    pageSize: number): 
    Promise<UserNoHashField[] | null> {
    const users = await mySQLUser.findAll(
      { where: { 
        role: role 
        },
        attributes: { 
          exclude: ['passwordHash', 'createdAt', 'updatedAt'] 
        },
        limit: pageSize,
        offset: page * pageSize 
      }
    );

    if(users) {
      const userNoHash: UserNoHashField[] = 
      users.map(user => user.toJSON());
      return userNoHash;
    }  else {
      return null;
    }
  }

  async getByMissingTrack(
    missingTrack: number, 
    page: number, 
    pageSize: number): 
    Promise<UserNoHashField[] | null> {
    const users = await mySQLUser.findAll(
      { where: { 
        missingTrack: missingTrack 
        },
        attributes: { 
          exclude: ['passwordHash', 'createdAt', 'updatedAt'] 
        },
        limit: pageSize,
        offset: page * pageSize 
      }
    );

    if(users) {
      const userNoHash: UserNoHashField[] = 
      users.map(user => user.toJSON());
      return userNoHash;
    } else {
      return null;
    }
  }

  async getAllUsers(
    page: number,
    pageSize: number
  ): Promise<UserNoHashField[] | null> {
    const collectedUsers = 
    await mySQLUser.findAll(
      { attributes: { 
        exclude: ['passwordHash', 'createdAt', 'updatedAt'] 
        },
        limit: pageSize,
        offset: page * pageSize 
      }
    );

    if (collectedUsers) {
      const usersArray: UserNoHashField[] = 
      collectedUsers.map(user => user.toJSON());
      return usersArray;
    } else {
      return null;
    }
  }

  async createUser(user: UserRegModFields): 
  Promise<UserNoHashField | null> {
    await mySQLUser.create(
      {
        username: user.username,
        passwordHash: user.passwordHash,
        email: user.email,
        phone: user.phone,
        name: user.name,
        surname: user.surname,
        role: user.role,
        missingTrack: 0
      }
    );

    const returnedUser = 
    await mySQLUser.findOne(
      { 
        where: {
          username: user.username
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt']
        }
      }
    );

    if (returnedUser) {
      const userNoHash: UserNoHashField = returnedUser.toJSON();
      return userNoHash;
    } else {
      return null;
    }
  }

  async modifyUser(userId: string, modifiedUser: Partial<UserRegModFields>): Promise<UserNoHashField> {
    const foundUser = await mySQLUser.findByPk(userId);
    if (!foundUser) {
      throw new Error('Could not find the user.');
    }
  
    const updatedUserData: UserRegModFields = 
    { ...foundUser.toJSON(), ...modifiedUser };
  
    await mySQLUser.update(
      updatedUserData, 
      { 
        where: { 
          userId: userId 
        } 
      }
    );
  
    const updatedUser = 
    await mySQLUser.findByPk(
      userId,
      {
        attributes: {
          exclude: ['passwordHash','createdAt', 'updatedAt']
        }
      }
    );

    if (!updatedUser) {
      throw new Error('Could not find the modified user.');
    }
  
    const userNoHash: UserNoHashField = updatedUser.toJSON();
    return userNoHash;
  }
  

  async deleteUser(userId: string): Promise<number> {
    const deleted = 
    await mySQLUser.destroy(
      { where: { 
        userId: userId 
        } 
      }
    );
    return deleted;
  }
}
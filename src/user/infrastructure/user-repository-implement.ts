import { DataTypes, Model, Sequelize } from "sequelize";
import { User, UserFieldsNoId, UserNoHash, UserNoId } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

class UserImplementation extends Model { }

const initUserModel = (sequelize: Sequelize) => {
  UserImplementation.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.CHAR(25),
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.CHAR(72),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.CHAR(50),
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.CHAR(50),
      },
      surname: {
        type: DataTypes.CHAR(50),
      },
      role: {
        type: DataTypes.ENUM('admin', 'user', 'barber')
      }
    },
    {
      sequelize,
      modelName: 'User'
    },
  );


};

export class mySQLUserRepository implements UserRepository {

  constructor(sequelize: Sequelize) {
    try {
      initUserModel(sequelize);
      UserImplementation.sync().catch(console.error);
    }
    catch (error: unknown) {
      console.log(error);
    }
  }

  async modifyUser(userId: number, modifiedUser: Partial<UserFieldsNoId>): Promise<UserNoHash> {
    const foundUser = await UserImplementation.findByPk(Number(userId));
    if (foundUser) {
      const originalUser: User = foundUser.toJSON();
      const collectedUser = await UserImplementation.update(
        {
          username: modifiedUser.username || originalUser.userFields.username,
          passwordHash: modifiedUser.passwordHash || originalUser.userFields.passwordHash,
          email: modifiedUser.email || originalUser.userFields.email,
          phone: modifiedUser.phone || originalUser.userFields.phone,
          name: modifiedUser.name || originalUser.userFields.name,
          surname: modifiedUser.surname || originalUser.userFields.surname,
          role: modifiedUser.role || originalUser.userFields.role
        },
        { where: { userId: Number(userId) } });

      if (collectedUser) {
        const newCollectedUser = await UserImplementation.findByPk(Number(userId));

        if (newCollectedUser) {
          const userHash: User = newCollectedUser.toJSON();

          const userNoHash: UserNoHash = new UserNoHash({
            userId: userHash.userFields.userId,
            username: userHash.userFields.username,
            email: userHash.userFields.email,
            phone: userHash.userFields.phone,
            name: userHash.userFields.name,
            surname: userHash.userFields.surname,
            role: userHash.userFields.role
          });

          return userNoHash;
        } else {
          throw new Error('Could not find the modified the user.');
        }
      } else {
        throw new Error('Could not modify the user.');
      }
    } else {
      throw new Error('Could not find the user.');
    }
  }

  async getById(userId: number): Promise<UserNoHash | null> {
    const collectedUser = await UserImplementation.findByPk(Number(userId));
    if (collectedUser) {
      const userHash: User = collectedUser.toJSON();

      const userNoHash: UserNoHash = new UserNoHash({
        userId: userHash.userFields.userId,
        username: userHash.userFields.username,
        email: userHash.userFields.email,
        phone: userHash.userFields.phone,
        name: userHash.userFields.name,
        surname: userHash.userFields.surname,
        role: userHash.userFields.role
      });

      return userNoHash;
    } else {
      return null;
    }
  }

  async getByUsername(username: string): Promise<User | null> {
    const collectedUser = await UserImplementation.findOne({ where: { username: username } });

    if (collectedUser) {
      const userHash: User = collectedUser.toJSON();

      return userHash;
    } else {
      return null;
    }
  }

  async getAllUsers(): Promise<UserNoHash[] | null> {
    const collectedUsers = await UserImplementation.findAll();

    if (collectedUsers) {
      const usersArray: User[] = collectedUsers.map(user => user.toJSON());
      const usersNoHashArray: UserNoHash[] = usersArray.map(user => new UserNoHash(
        {
          userId: user.userFields.userId,
          username: user.userFields.username,
          email: user.userFields.email,
          phone: user.userFields.phone,
          name: user.userFields.name,
          surname: user.userFields.surname,
          role: user.userFields.role
        }
      ));

      return usersNoHashArray;
    } else {
      return null;
    }
  }

  async createUser(user: UserNoId): Promise<UserNoHash | null> {
    const newUser = await UserImplementation.create({
      username: user.userFieldsNoId.username,
      passwordHash: user.userFieldsNoId.passwordHash,
      email: user.userFieldsNoId.email,
      phone: user.userFieldsNoId.phone,
      name: user.userFieldsNoId.name,
      surname: user.userFieldsNoId.surname,
      role: user.userFieldsNoId.role
    });

    if (newUser) {
      const collectedUser: User = newUser.toJSON();

      const userNoHash: UserNoHash = new UserNoHash({
        userId: collectedUser.userFields.userId,
        username: collectedUser.userFields.username,
        email: collectedUser.userFields.email,
        phone: collectedUser.userFields.phone,
        name: collectedUser.userFields.name,
        surname: collectedUser.userFields.surname,
        role: collectedUser.userFields.role
      });

      return userNoHash;
    } else {
      return null;
    }
  }

  async deleteUser(userId: number): Promise<number> {
    const deleted = await UserImplementation.destroy({ where: { userId: Number(userId) } });
    return deleted;
  }
}
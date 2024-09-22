import { User, userFieldsNoId, userNoHash, UserNoId } from "../domain/user";
import { UserRepository } from "../domain/user-repository";


export class mySQLUserRepository implements UserRepository {

  modifyUser(_userId: string, _modifiedUser: userFieldsNoId): Promise<userNoHash | null> {
    throw new Error("Method not implemented.");
  }
  getById(_userId: string): Promise<userNoHash | null> {
    // Eliminate passwordHash from here
    throw new Error("Method not implemented.");
  }
  getByUsername(_username: string): Promise<userNoHash | null> {
    // Eliminate passwordHash from here
    throw new Error("Method not implemented.");
  }
  getAllUsers(): Promise<userNoHash[] | null> {
    // Eliminate passwordHash from here
    throw new Error("Method not implemented.");
  }
  createUser(_user: UserNoId): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  deleteUser(_userId: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}
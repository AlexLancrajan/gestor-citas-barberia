import { User, UserFieldsNoId, UserNoHash, UserNoId } from "./user";

export interface UserRepository {
  getById(userId: string): Promise<UserNoHash | null>;

  getByUsername(username: string): Promise<User | null> // This one is for loging purposes

  getAllUsers(): Promise<UserNoHash[] | null>;

  createUser(user: UserNoId): Promise<UserNoHash | null>;

  deleteUser(userId: string): Promise<number>;

  modifyUser(userId: string, modifiedUser: Partial<UserFieldsNoId>): Promise<UserNoHash | Error>
}

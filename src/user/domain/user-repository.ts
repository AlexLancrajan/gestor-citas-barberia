import { User, UserFieldsNoId, UserNoHash, UserNoId } from "./user";

export interface UserRepository {
  getById(userId: number): Promise<UserNoHash | null>;

  getByUsername(username: string): Promise<User | null>; // This one is for loging purposes

  getAllUsers(): Promise<UserNoHash[] | null>;

  createUser(user: UserNoId): Promise<UserNoHash | null>;

  deleteUser(userId: number): Promise<number>;

  modifyUser(userId: number, modifiedUser: Partial<UserFieldsNoId>): Promise<UserNoHash>
}

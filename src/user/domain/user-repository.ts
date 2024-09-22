import { User, userFieldsNoId, userNoHash, UserNoId } from "./user";

export interface UserRepository {
  getById(userId: string): Promise<userNoHash | null>;

  getByUsername(username: string): Promise<userNoHash | null>;

  getAllUsers(): Promise<userNoHash[] | null>;

  createUser(user: UserNoId): Promise<User | null>;

  deleteUser(userId: string): Promise<User | null>;

  modifyUser(userId: string, modifiedUser: userFieldsNoId): Promise<userNoHash | null>
}

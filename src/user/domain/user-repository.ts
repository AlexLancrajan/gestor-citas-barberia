import { UserRegModFields, Roles, UserNoHashField, UserFields } from "./user";

/**
 * This is the abstract repository that contains all the operation that could be performed to the User entity.
 */
export interface UserRepository {

  getById(userId: string): Promise<UserNoHashField | null>;

  getByUsername(username: string): Promise<UserFields | null>;

  /**It needs admin privileges. */
  getByRole(role: Roles, page: number, pageSize: number): 
  Promise<UserNoHashField[] | null>;

  getByMissingTrack(missingTrack: number, page: number, pageSize: number): 
  Promise<UserNoHashField[] | null>;

  getAllUsers(page: number, pageSize: number): Promise<UserNoHashField[] | null>;

  createUser(user: UserRegModFields): Promise<UserNoHashField | null>;

  deleteUser(userId: string): Promise<number>;

  modifyUser(userId: string, modifiedUser: Partial<UserRegModFields>): Promise<UserNoHashField>
}

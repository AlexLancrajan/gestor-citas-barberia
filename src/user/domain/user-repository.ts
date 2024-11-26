/**
 * Definition of the user repository including all the action that could be
 * performed to user concept.
 */

import { UserRegModFields, Roles, UserNoHashField, UserFields } from "./user";


export interface UserRepository {
  /**
  * Find operations.
  */
  //For all roles.
  getById(userId: string): Promise<UserNoHashField | null>;

  getByUsername(username: string): Promise<UserFields | null>;

  //For admins only.
  getByRole(role: Roles, page: number, pageSize: number): 
  Promise<UserNoHashField[] | null>;

  getByMissingTrack(missingTrack: number, page: number, pageSize: number): 
  Promise<UserNoHashField[] | null>;

  getAllUsers(page: number, pageSize: number): Promise<UserNoHashField[] | null>;

  /**
  * Create operations.
  */
  createUser(user: UserRegModFields): Promise<UserNoHashField | null>;

  /**
  * Delete operations.
  */
  deleteUser(userId: string): Promise<number>;

  /**
  * Modification operations.
  */
  modifyUser(userId: string, modifiedUser: Partial<UserRegModFields>): Promise<UserNoHashField>
}

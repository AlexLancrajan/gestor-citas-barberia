/**
 * Modification actions class. It contains all the modification operations
 * supported on user. It uses the user repository.
*/

import { UserNoHashField, UserRegModFields } from "../domain/user";
import { UserRepository } from "../domain/user-repository";


export class ModifyUser {
  constructor(private readonly userRepository: UserRepository) { }

  async run(userId: string, modifiedUser: Partial<UserRegModFields>): 
  Promise<UserNoHashField> {
    try {
      const user = 
      await this.userRepository.modifyUser(userId, modifiedUser);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
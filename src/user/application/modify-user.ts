import { UserNoHashField, UserRegModFields } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

/**It contains the rules and logic to perform the User modification operations. */
export class ModifyUser {
  constructor(private readonly userRepository: UserRepository) { }

  /**If the operation could not be completed, it returns an error. */
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
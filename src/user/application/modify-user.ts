import { UserFieldsNoId, UserNoHash } from "../domain/user";
import { UserRepository } from "../domain/user-repository";


export class ModifyUser {
  constructor(private readonly userRepository: UserRepository) { }

  async run(userId: number, modifiedUser: Partial<UserFieldsNoId>): Promise<UserNoHash> {
    try {
      const user = await this.userRepository.modifyUser(userId, modifiedUser);
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
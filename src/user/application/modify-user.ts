import { UserFieldsNoId } from "../domain/user";
import { UserRepository } from "../domain/user-repository";


export class ModifyUser {
  constructor(private readonly userRepository: UserRepository) { }

  async run(userId: string, modifiedUser: Partial<UserFieldsNoId>) {
    try {
      const user = await this.userRepository.modifyUser(userId, modifiedUser);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error on user updating.');
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
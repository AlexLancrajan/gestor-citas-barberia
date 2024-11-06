import { UserNoHash, UserNoId } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

export class RegisterUser {

  constructor(private readonly userRepository: UserRepository) { }

  async run(user: UserNoId): Promise<UserNoHash> {
    const createdUser = await this.userRepository.createUser(user);

    if (!createdUser) {
      throw new Error(`User ${user.userFieldsNoId.username} could not be created`);
    }

    return createdUser;
  };
}
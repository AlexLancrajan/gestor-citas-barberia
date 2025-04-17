import { UserRegModFields, UserNoHashField } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

/**It contains the rules and logic to perform the user registration opertaions. */
export class RegisterUser {

  constructor(private readonly userRepository: UserRepository) { }

  /**If the process fail it returns User: username could not be created error. */
  async run(user: UserRegModFields): Promise<UserNoHashField> {
    const createdUser = await this.userRepository.createUser(user);

    if (!createdUser) {
      throw new Error(`User ${user.username} could not be created`);
    }

    return createdUser;
  };
}
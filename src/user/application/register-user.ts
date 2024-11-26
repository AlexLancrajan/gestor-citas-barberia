/**
 * Register actions class. It supports all the operations required to register
 * an user. 
 * It uses the repository concept to perform this actions.
 */

import { UserRegModFields, UserNoHashField } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

export class RegisterUser {

  constructor(private readonly userRepository: UserRepository) { }

  async run(user: UserRegModFields): Promise<UserNoHashField> {
    const createdUser = await this.userRepository.createUser(user);

    if (!createdUser) {
      throw new Error(`User ${user.username} could not be created`);
    }

    return createdUser;
  };
}
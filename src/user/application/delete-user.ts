/**
 * Delete actions class. It supports the deleted operations supported in
 * User. It uses the user repository.
*/

import { UserRepository } from "../domain/user-repository";

export class DeleteUser {

  //User repository is used to perform the actions.
  constructor(private readonly userRepository: UserRepository) { }

  async run(userId: string): Promise<number> {
    const deletedUser = await this.userRepository.deleteUser(userId);

    if (!deletedUser) 
      throw new Error('User already deleted');

    return deletedUser;
  }
}
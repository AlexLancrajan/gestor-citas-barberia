import { UserRepository } from "../domain/user-repository";

/** */
export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) { }

  /**If the user is already deleted it returns an error. */
  async run(userId: string): Promise<number> {
    const deletedUser = await this.userRepository.deleteUser(userId);

    if (!deletedUser) 
      throw new Error('User already deleted');

    return deletedUser;
  }
}
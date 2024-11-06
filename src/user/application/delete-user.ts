import { UserRepository } from "../domain/user-repository";


export class DeleteUser {

  constructor(private readonly userRepository: UserRepository) { }

  async run(userId: number): Promise<number | string> {
    const deletedUser = await this.userRepository.deleteUser(userId);

    if (deletedUser === 0) return 'User already deleted.';

    return deletedUser;
  }
}
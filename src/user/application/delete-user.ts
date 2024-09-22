import { UserRepository } from "../domain/user-repository";


export class DeleteUser {

  constructor(private readonly userRepository: UserRepository) { }

  async run(userId: string) {
    const deletedUser = await this.userRepository.deleteUser(userId);

    if (!deletedUser) return 'User already deleted.';

    return deletedUser;
  }
}
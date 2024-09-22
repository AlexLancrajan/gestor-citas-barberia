import { UserRepository } from "../domain/user-repository";


export class FindUser {
  constructor(private readonly userRepository: UserRepository) { }

  async runFindUser(username: string) {
    const user = await this.userRepository.getByUsername(username);

    if (!user) throw new Error('User not found');

    return user;
  }

  async runFindUserId(userId: string) {
    const user = await this.userRepository.getById(userId);

    if (!user) throw new Error('User not found');

    return user;
  }

  async runFindUsers() {
    const users = await this.userRepository.getAllUsers();

    if (!users) throw new Error('User repository is empty.');

    return users;
  }

}
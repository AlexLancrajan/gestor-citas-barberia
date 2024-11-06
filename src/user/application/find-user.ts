import { User, UserNoHash } from "../domain/user";
import { UserRepository } from "../domain/user-repository";


export class FindUser {
  constructor(private readonly userRepository: UserRepository) { }

  async runFindUser(username: string): Promise<User> {
    const user = await this.userRepository.getByUsername(username);

    if (!user) throw new Error('User not found');

    return user;
  }

  async runFindUserId(userId: number): Promise<UserNoHash> {
    const user = await this.userRepository.getById(userId);

    if (!user) throw new Error('User not found');

    return user;
  }


  async runFindUsers(): Promise<UserNoHash[]> {
    const users = await this.userRepository.getAllUsers();

    if (!users) throw new Error('User repository is empty.');

    return users;
  }

}
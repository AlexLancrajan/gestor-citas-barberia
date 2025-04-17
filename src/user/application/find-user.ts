import { Roles, UserFields, UserNoHashField } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

/**
 * It defines the rules and logic to perfom the find user operations.
 */
export class FindUser {
  constructor(private readonly userRepository: UserRepository) { }
  
  /**If not user is found it throws a User not found error. */
  async runFindUserId(userId: string): Promise<UserNoHashField> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  /**If not user is found it throws a User not found error. */
  async runFindUser(username: string): Promise<UserFields> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) throw new Error('User not found');
    return user;
  }

  /**If not users are found it throws a Users not found error. */
  async runFindUsersByRole(
    role: Roles,
    page: number,
    pageSize: number): 
    Promise<UserNoHashField[]> {
    const users = 
    await this.userRepository.getByRole(role, page, pageSize);

    if(!users) throw new Error('Users not found');
    return users;
  }

  /**If not users are found it throws a Users not found error. */
  async runFindUsersByMissingTrack(
    missingTrack: number,
    page: number,
    pageSize: number):
    Promise<UserNoHashField[]> {
    const user = 
    await this.userRepository.getByMissingTrack(
      missingTrack, 
      page, 
      pageSize
    );

    if(!user) throw new Error('Users not found');
    return user;
  }

  /**If not users are found it throws a Users not found error. */
  async runFindUsers(page: number, pageSize: number): 
  Promise<UserNoHashField[]> {
    const users = 
    await this.userRepository.getAllUsers(page, pageSize);
    if (!users) throw new Error('Users not found.');
    return users;
  }

}
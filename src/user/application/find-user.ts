/**
 * Find actions class. It contains all the operations used for retrieving
 * users from the repository. 
*/

import { Roles, UserFields, UserNoHashField } from "../domain/user";
import { UserRepository } from "../domain/user-repository";

export class FindUser {
  //User repository is used to perform the actions.
  constructor(private readonly userRepository: UserRepository) { }
  
  async runFindUserId(userId: string): Promise<UserNoHashField> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async runFindUser(username: string): Promise<UserFields> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) throw new Error('User not found');
    return user;
  }

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

    if(!user) throw new Error('User not found');
    return user;
  }

  async runFindUsers(page: number, pageSize: number): 
  Promise<UserNoHashField[]> {
    const users = 
    await this.userRepository.getAllUsers(page, pageSize);

    if (!users) throw new Error('User repository is empty.');
    return users;
  }

}
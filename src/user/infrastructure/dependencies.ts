// Initialize userRepository with DataBase
// Initialize use cases.
// Export user controller initialized with use cases.

import { DeleteUser } from "../application/delete-user";
import { FindUser } from "../application/find-user";
import { ModifyUser } from "../application/modify-user";
import { RegisterUser } from "../application/register-user";
import { UserController } from "./user-controller";
import { mySQLUserRepository } from "./user-repository-implement";

const userRepository = new mySQLUserRepository();

const registerUser = new RegisterUser(userRepository);

const findUser = new FindUser(userRepository);

const deleteUser = new DeleteUser(userRepository);

const modifyUser = new ModifyUser(userRepository);

export const userController = new UserController(
  registerUser,
  findUser,
  deleteUser,
  modifyUser
);
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import { validateUserData } from '../../middleware';
import { userLoginSchema, userModificationSchema, userRegistrationSchema } from './user-schema';
import { userController } from './dependencies';

const userRouter = express.Router();

userRouter.post(
  '/register',
  validateUserData(userRegistrationSchema),
  userController.registerUserFunction.bind(userController)
);

userRouter.post(
  '/login',
  validateUserData(userLoginSchema),
  userController.loginUserFunction.bind(userController)
);

userRouter.post(
  '/refresh',
  userController.refreshTokenFunction.bind(userController)
);

userRouter.get(
  '/:id',
  userController.findUserFunction.bind(userController)
);

userRouter.get(
  '/',
  userController.findAllUsersFunction.bind(userController)
);

userRouter.delete(
  '/:id',
  userController.deleteUserFunction.bind(userController)
);

userRouter.put(
  '/:id',
  validateUserData(userModificationSchema),
  userController.modifyUserFunction.bind(userController)
);


export { userRouter };
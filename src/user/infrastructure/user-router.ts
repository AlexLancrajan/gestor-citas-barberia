/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import { validateSchemaData } from '../../middleware';
import { userLoginSchema, userModificationSchema, userRegistrationSchema } from './user-schema';
import { userController } from './dependencies';

const userRouter = express.Router();

userRouter.post(
  '/register',
  validateSchemaData(userRegistrationSchema),
  userController.registerUserFunction.bind(userController)
);

userRouter.post(
  '/login',
  validateSchemaData(userLoginSchema),
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
  validateSchemaData(userModificationSchema),
  userController.modifyUserFunction.bind(userController)
);


export { userRouter };
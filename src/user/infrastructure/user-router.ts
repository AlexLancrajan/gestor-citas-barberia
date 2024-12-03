/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import { verifyTokenMiddleware, validateSchemaData } from '../../ztools/middleware';
import { userLoginSchema, userRegistrationSchema, userModificationsSchema, /*userGoogleRegistrationSchema*/ } from './user-schema';
import { userController } from './dependencies';

const userRouter = express.Router();

/*userRouter.post(
  '/register/google',
  validateSchemaData(userGoogleRegistrationSchema),
  userController.registerGoogleUserFunction.bind(userController)
);*/

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

userRouter.get(
  '/refresh',
  userController.refreshUserFunctionality.bind(userController)
);

userRouter.get(
  '/:id',
  verifyTokenMiddleware,
  userController.findUserFunction.bind(userController)
);

userRouter.get(
  '/',
  verifyTokenMiddleware,
  userController.findAllUsersFunction.bind(userController)
);

userRouter.delete(
  '/:id',
  verifyTokenMiddleware,
  userController.deleteUserFunction.bind(userController)
);

userRouter.put(
  '/:id',
  verifyTokenMiddleware,
  validateSchemaData(userModificationsSchema),
  userController.modifyUserFunction.bind(userController)
);


export { userRouter };
/* eslint-disable @typescript-eslint/no-misused-promises */

import express from 'express';
import { barberServiceController } from './dependencies';
import { validateSchemaData, verifyTokenMiddleware } from '../../ztools/middleware';
import { barberServiceSchema, createBarberServiceSchema } from './barberService-schema';

const barberServiceRouter = express.Router();

barberServiceRouter.get(
  '/one',
  barberServiceController.findBarberServiceFunction.bind(barberServiceController)
);

barberServiceRouter.get(
  '/all',
  barberServiceController.findAllBarberServiceFunction.bind(barberServiceController)
);

barberServiceRouter.post(
  '/',
  verifyTokenMiddleware,
  validateSchemaData(createBarberServiceSchema),
  barberServiceController.createBarberServiceFunction.bind(barberServiceController)
);

barberServiceRouter.put(
  '/',
  verifyTokenMiddleware,
  validateSchemaData(barberServiceSchema),
  barberServiceController.modifyBarberServiceFunction.bind(barberServiceController)
);

barberServiceRouter.delete(
  '/',
  verifyTokenMiddleware,
  barberServiceController.deleteBarberServiceFuntion.bind(barberServiceController)
);

export default barberServiceRouter;
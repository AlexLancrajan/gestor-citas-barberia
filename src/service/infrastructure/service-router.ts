/* eslint-disable @typescript-eslint/no-misused-promises */

import express from 'express';
import { serviceController } from './dependencies';
import { validateSchemaData, verifyTokenMiddleware } from '../../ztools/middleware';
import { serviceModificationSchema, serviceSchema } from './service-schema';

const serviceRouter = express.Router();

serviceRouter.get(
  '/', 
  serviceController.findServicesFunction.bind(serviceController)
);

serviceRouter.get(
  '/:id', 
  serviceController.findServiceFunction.bind(serviceController)
);

serviceRouter.post(
  '/', 
  verifyTokenMiddleware, 
  validateSchemaData(serviceSchema), 
  serviceController.createServiceFunction.bind(serviceController)
);

serviceRouter.put(
  '/:id', 
  verifyTokenMiddleware, 
  validateSchemaData(serviceModificationSchema), 
  serviceController.modifyServiceFunction.bind(serviceController));

serviceRouter.delete(
  '/:id',
  verifyTokenMiddleware, 
  serviceController.deleteServiceFunction.bind(serviceController)
);

export { serviceRouter };
/* eslint-disable @typescript-eslint/no-misused-promises */

import express from 'express';
import { serviceController } from './dependencies';
import { validateSchemaData } from '../../middleware';
import { serviceSchema } from './service-schema';

const serviceRouter = express.Router();

serviceRouter.get('/', serviceController.findServicesFunction.bind(serviceController));

serviceRouter.get('/:id', serviceController.findServiceFunction.bind(serviceController));

serviceRouter.post('/', validateSchemaData(serviceSchema), serviceController.createServiceFunction.bind(serviceController));

serviceRouter.put('/:id', validateSchemaData(serviceSchema), serviceController.modifyServiceFunction.bind(serviceController));

serviceRouter.delete('/:id', serviceController.deleteServiceFunction.bind(serviceController));

export { serviceRouter };
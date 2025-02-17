/* eslint-disable @typescript-eslint/no-misused-promises */

import express from 'express';
import { serviceSiteController } from './dependencies';
import { validateSchemaData, verifyTokenMiddleware } from '../../ztools/middleware';
import { serviceSiteSchema, createServiceSiteSchema } from './serviceSite-schema';

const serviceSiteRouter = express.Router();

serviceSiteRouter.get(
  '/one',
  serviceSiteController.findServiceSiteFunction.bind(serviceSiteController)
);

serviceSiteRouter.get(
  '/all',
  serviceSiteController.findAllserviceSiteFunction.bind(serviceSiteController)
);

serviceSiteRouter.post(
  '/',
  verifyTokenMiddleware,
  validateSchemaData(createServiceSiteSchema),
  serviceSiteController.createserviceSiteFunction.bind(serviceSiteController)
);

serviceSiteRouter.put(
  '/',
  verifyTokenMiddleware,
  validateSchemaData(serviceSiteSchema),
  serviceSiteController.modifyserviceSiteFunction.bind(serviceSiteController)
);

serviceSiteRouter.delete(
  '/',
  verifyTokenMiddleware,
  serviceSiteController.deleteserviceSiteFuntion.bind(serviceSiteController)
);

export default serviceSiteRouter;
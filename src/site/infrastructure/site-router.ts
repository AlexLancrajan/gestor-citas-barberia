/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { siteController } from './dependencies';
import { validateSchemaData, verifyTokenMiddleware } from '../../ztools/middleware';
import { siteSchema } from './site-schema';

const siteRouter = express.Router();

siteRouter.get(
  '/', 
  siteController.findSitesFunction.bind(siteController)
);

siteRouter.get(
  '/:id', 
  siteController.findSiteFunction.bind(siteController)
);

siteRouter.post('/',
  verifyTokenMiddleware, 
  validateSchemaData(siteSchema), 
  siteController.createSiteFunction.bind(siteController)
);

siteRouter.put(
  '/:id', 
  verifyTokenMiddleware,
  validateSchemaData(siteSchema), 
  siteController.modifySiteFunction.bind(siteController)
);

siteRouter.delete('/:id',
  verifyTokenMiddleware, 
  siteController.deleteSiteFunction.bind(siteController)
);

export { siteRouter };
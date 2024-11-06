/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { siteController } from './dependencies';
import { validateSchemaData } from '../../middleware';
import { siteSchema } from './site-schema';

const siteRouter = express.Router();

siteRouter.get('/', siteController.findSitesFunction.bind(siteController));

siteRouter.get('/:id', siteController.findSiteFunction.bind(siteController));

siteRouter.post('/', validateSchemaData(siteSchema), siteController.createSiteFunction.bind(siteController));

siteRouter.put('/:id', validateSchemaData(siteSchema), siteController.modifySiteFunction.bind(siteController));

siteRouter.delete('/:id', siteController.deleteSiteFunction.bind(siteController));

export { siteRouter };
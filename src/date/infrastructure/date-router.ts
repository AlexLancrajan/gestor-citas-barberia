/* eslint-disable @typescript-eslint/no-misused-promises */
 
import express from 'express';
import { dateController } from './dependencies';
import { validateSchemaData, verifyTokenMiddleware } from '../../ztools/middleware';
import { automaticDatesSchema, dailyDatesSchema, dateInputSchema, dateModificationSchema, dateNoAvailabilitySchema, occupationDatesSchema, siteIdRefSchema } from './date-schema';

const dateRouter = express.Router();

dateRouter.get(
  '/',
  validateSchemaData(siteIdRefSchema),
  dateController.getDatesFunction.bind(dateController)
);

dateRouter.get(
  '/:id', 
  dateController.getDateByIdFunction.bind(dateController)
);

dateRouter.get(
  '/date',
  validateSchemaData(dateNoAvailabilitySchema),
  dateController.getDateByDateFunction.bind(dateController)
);

dateRouter.get(
  '/occupation',
  validateSchemaData(occupationDatesSchema),
  dateController.getOccupationFunction.bind(dateController)
);

dateRouter.post(
  '/daily',
  verifyTokenMiddleware, 
  validateSchemaData(dailyDatesSchema), 
  dateController.createDailyDatesFunction.bind(dateController)
);

dateRouter.post(
  '/automatic', 
  verifyTokenMiddleware, 
  validateSchemaData(automaticDatesSchema), 
  dateController.createAutomaticDatesFunction.bind(dateController)
);

dateRouter.post(
  '/manual', 
  verifyTokenMiddleware, 
  validateSchemaData(dateInputSchema), 
  dateController.createManualDatesFunction.bind(dateController)
);

dateRouter.put(
  '/:id', 
  verifyTokenMiddleware, 
  validateSchemaData(dateModificationSchema), 
  dateController.modifyDateFunction.bind(dateController)
);

dateRouter.delete(
  '/automatic',
  verifyTokenMiddleware, 
  dateController.deleteAutomaticDateFunction.bind(dateController)
);

dateRouter.delete(
  '/:id',
  verifyTokenMiddleware, 
  dateController.deleteDateByIdFunction.bind(dateController)
);

dateRouter.delete(
  '/site',
  verifyTokenMiddleware, 
  dateController.deleteDatesFromSiteFunction.bind(dateController)
);


export { dateRouter };
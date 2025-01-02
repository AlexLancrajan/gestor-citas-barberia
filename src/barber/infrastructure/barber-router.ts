/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { barberController } from "./dependencies";
import { validateSchemaData, verifyTokenMiddleware } from "../../ztools/middleware";
import { barberInputSchema, barberModificationSchema } from "./barber-schema";

const barberRouter = Router();

barberRouter.get(
  '/',
  barberController.findBarbersFunction.bind(barberController)
);

barberRouter.get(
  '/:id',
  barberController.findBarberFunction.bind(barberController)
);

barberRouter.post(
  '/',
  verifyTokenMiddleware,
  validateSchemaData(barberInputSchema),
  barberController.createBarbersFunction.bind(barberController)
);

barberRouter.put(
  '/:id',
  verifyTokenMiddleware,
  validateSchemaData(barberModificationSchema),
  barberController.modifyBarbersFunction.bind(barberController)
);

barberRouter.delete(
  '/:id',
  verifyTokenMiddleware,
  barberController.deleteBarbersFunction.bind(barberController)
);

export { barberRouter };
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { barberController } from "./dependencies";
import { verifyTokenMiddleware } from "../../ztools/middleware";

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
  barberController.createBarbersFunction.bind(barberController)
);

barberRouter.put(
  '/:id',
  verifyTokenMiddleware,
  barberController.modifyBarbersFunction.bind(barberController)
);

barberRouter.delete(
  '/:id',
  verifyTokenMiddleware,
  barberController.deleteBarbersFunction.bind(barberController)
);

export { barberRouter };
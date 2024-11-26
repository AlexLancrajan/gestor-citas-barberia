/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { appointmentController } from './dependencies';
import { validateSchemaData } from '../../ztools/middleware';
import { appointmentSchema, dateSchema } from './appointment-schema';

const appointmentRouter = express.Router();

appointmentRouter.get('/', appointmentController.getAppointmentsFunction.bind(appointmentController));

appointmentRouter.get('/:id', appointmentController.getAppointmentFunction.bind(appointmentController));

appointmentRouter.post('/', validateSchemaData(appointmentSchema), appointmentController.createAppointmentsFunction.bind(appointmentController));

appointmentRouter.put('/:id', validateSchemaData(appointmentSchema), appointmentController.modifyAppointmentFunction.bind(appointmentController));

appointmentRouter.delete('/:id', appointmentController.deleteAppointmentFunction.bind(appointmentController));

appointmentRouter.post('/:id', validateSchemaData(dateSchema), appointmentController.checkAppointmentFunction.bind(appointmentController));

export { appointmentRouter };
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { bookingController } from './dependencies';
import { validateSchemaData } from '../../ztools/middleware';
import { bookingSchema } from './booking-schema';

const bookingRouter = express.Router();

bookingRouter.get('/', bookingController.getBookingsFunction.bind(bookingController));

bookingRouter.get('/:id', bookingController.getBookingFunction.bind(bookingController));

bookingRouter.post('/', validateSchemaData(bookingSchema), bookingController.createBookingFunction.bind(bookingController));

bookingRouter.put('/:id', validateSchemaData(bookingSchema), bookingController.modifyBookingFunction.bind(bookingController));

bookingRouter.delete('/:id', bookingController.deleteBookingFunction.bind(bookingController));

export { bookingRouter };
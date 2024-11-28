/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { bookingController } from './dependencies';
import { validateSchemaData } from '../../ztools/middleware';
import { bookingNoPaymentInputSchema, bookingPaymentInputSchema, bookingQuerySchema, bookingQueryUserSchema, paymentSchema, refundPaymentSchema } from './booking-schema';

const bookingRouter = express.Router();

bookingRouter.get(
  '/admin',
  validateSchemaData(bookingQuerySchema), 
  bookingController.getBookingsForAdminFunction.bind(bookingController)
);

bookingRouter.get(
  '/user',
  validateSchemaData(bookingQueryUserSchema),
  bookingController.getBookingsForUserFunction.bind(bookingController)
);

bookingRouter.get(
  '/:id', 
  bookingController.getBookingFunction.bind(bookingController)
);

bookingRouter.post(
  '/nopayment', 
  validateSchemaData(bookingNoPaymentInputSchema), 
  bookingController.createBookingNoPaymentFunction.bind(bookingController)
);

bookingRouter.post(
  '/payment', 
  validateSchemaData(bookingPaymentInputSchema), 
  bookingController.createBookingWithPaymentFunction.bind(bookingController)
);

bookingRouter.put(
  '/:id', 
  validateSchemaData(bookingNoPaymentInputSchema), 
  bookingController.modifyBookingFunction.bind(bookingController)
);

bookingRouter.delete(
  '/:id',
  validateSchemaData(bookingNoPaymentInputSchema),  
  bookingController.deleteBookingFunction.bind(bookingController)
);

bookingRouter.post(
  '/stripe/create',
  validateSchemaData(paymentSchema),
  bookingController.initiatePayment.bind(bookingController)
);

bookingRouter.get(
  '/stripe/:id',
  bookingController.fetchPayment.bind(bookingController)
);

bookingRouter.post(
  '/stripe/cancel/:bookingId',
  validateSchemaData(refundPaymentSchema),
  bookingController.cancelPaymentFunction.bind(bookingController)
);

bookingRouter.post(
  '/stripe/refund/:bookingId',
  validateSchemaData(refundPaymentSchema),
  bookingController.refundPaymentFunction.bind(bookingController)
);

export { bookingRouter };
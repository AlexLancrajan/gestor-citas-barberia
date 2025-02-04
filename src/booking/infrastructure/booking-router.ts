/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { bookingController } from './dependencies';
import { validateSchemaData, verifyTokenMiddleware } from '../../ztools/middleware';
import { bookingModificationSchema, bookingNoPaymentInputSchema, bookingPaymentInputSchema, bookingQueryAdminSchema, bookingQueryUserSchema, paymentSchema, refundPaymentSchema } from './booking-schema';

const bookingRouter = express.Router();

bookingRouter.get(
  '/admin',
  verifyTokenMiddleware,
  validateSchemaData(bookingQueryAdminSchema), 
  bookingController.getBookingsForAdminFunction.bind(bookingController)
);

bookingRouter.get(
  '/user',
  verifyTokenMiddleware,
  validateSchemaData(bookingQueryUserSchema),
  bookingController.getBookingsForUserFunction.bind(bookingController)
);

bookingRouter.get(
  '/:id', 
  verifyTokenMiddleware,
  bookingController.getBookingFunction.bind(bookingController)
);

bookingRouter.post(
  '/nopayment', 
  verifyTokenMiddleware,
  validateSchemaData(bookingNoPaymentInputSchema), 
  bookingController.createBookingNoPaymentFunction.bind(bookingController)
);

bookingRouter.post(
  '/payment', 
  verifyTokenMiddleware,
  validateSchemaData(bookingPaymentInputSchema), 
  bookingController.createBookingWithPaymentFunction.bind(bookingController)
);

bookingRouter.put(
  '/:id', 
  verifyTokenMiddleware,
  validateSchemaData(bookingModificationSchema), 
  bookingController.modifyBookingFunction.bind(bookingController)
);

bookingRouter.delete(
  '/:id',
  verifyTokenMiddleware,
  bookingController.deleteBookingFunction.bind(bookingController)
);

//Stripe functionality for bookings.
bookingRouter.get(
  '/stripe/:id',
  verifyTokenMiddleware,
  bookingController.fetchPayment.bind(bookingController)
);

bookingRouter.post(
  '/stripe/create',
  verifyTokenMiddleware,
  validateSchemaData(paymentSchema),
  bookingController.initiatePayment.bind(bookingController)
);

bookingRouter.put(
  '/stripe/cancel/:bookingId',
  verifyTokenMiddleware,
  validateSchemaData(refundPaymentSchema),
  bookingController.cancelPaymentFunction.bind(bookingController)
);

bookingRouter.put(
  '/stripe/refund/:bookingId',
  verifyTokenMiddleware,
  validateSchemaData(refundPaymentSchema),
  bookingController.refundPaymentFunction.bind(bookingController)
);

export { bookingRouter };
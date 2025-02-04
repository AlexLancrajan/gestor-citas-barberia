import { CreateBooking } from "../application/create-booking";
import { DeleteBooking } from "../application/delete-booking";
import { FindBooking } from "../application/find-booking";
import { ModifyBooking } from "../application/modify-booking";
import { Roles } from "../../user/domain/user";
import { Availability } from "../../date/domain/date";
import { BookingPaymentInputSchema, BookingNoPaymentInputSchema, BookingQueryAdminSchema, BookingQueryUserSchema, PaymentSchema, RefundPaymentSchema, BookingModificationSchema } from "./booking-schema";
import { findDate, modifyDate } from "../../date/infrastructure/dependencies";
import options from "../../ztools/config";

import { Request, Response } from "express";
import { omit } from "lodash";
import { checkTimeRemaining } from "../../ztools/utils";
import { cancelPayment, createPaymentIntent, createRefunds, getPaymentIntent } from "../../ztools/stripe-service";


export class BookingController {
  constructor(
    private readonly findBooking: FindBooking,
    private readonly createBooking: CreateBooking,
    private readonly modifyBooking: ModifyBooking,
    private readonly deleteBooking: DeleteBooking,
  ) { }

  async getBookingFunction(req: Request, res: Response) {
    const bookingId = req.params.id;
    const userId = req.userToken?.userId;
    const role = req.userToken?.role.toString().toLowerCase();
    const getUser = Boolean(req.query?.getUser) || false;
    const getSite = Boolean(req.query?.getSite) || false;
    const getService = Boolean(req.query?.getService);

    try {
      const booking = await this.findBooking.runGetBooking(
        bookingId, getUser, getSite, getService);
      if (userId !== booking.userId && 
          role !== Roles.admin) 
          return res.status(401).json({ error: 'Unauthorized access' });
      else {
        const noHashBooking = {
          ...booking,
          ...(getUser ? 
            {
              User: omit(booking.User, ['passwordHash'])
            } : undefined
          )
        };
        return res.json(noHashBooking);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async getBookingsForAdminFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const bookingQuery = req.body as BookingQueryAdminSchema;
    try {
      const bookings = await this.findBooking.runGetBookingsForAdmin(
        bookingQuery
      );
      return res.json(bookings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async getBookingsForUserFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    const decodedUserId = req.userToken?.userId || "invalid";
    if (!role) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const {
      userId = decodedUserId,
      page = 0,
      pageSize = 50,
      getUser = false,
      getSite = false,
      getService = false,
    } = req.body as BookingQueryUserSchema;
    try {
      const bookings = await this.findBooking.runGetBookingsForUser(
        userId, page, pageSize, getUser, getSite, getService
      );
      return res.json(bookings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async createBookingNoPaymentFunction(req: Request, res: Response) {
    const missingTrack = req.userToken?.missingTrack;

    if(missingTrack === undefined) {
      return res.status(400).json({ error: 'missingTrack not found'});
    }
    if(missingTrack > 2) {
      return res.status(401).json({ error: 'Too much missing track.'});
    }

    const bookingInputFields = req.body as BookingNoPaymentInputSchema;
    try {
      const date = await findDate.runDateByDate(
        bookingInputFields.bookingDate, bookingInputFields.siteId);
      
      if(!date || date.dateAvailability === Availability.full) {
        return res.status(400).json({ error: 'Date for this site already occupied.' });
      } else {
        date.dateAvailability = Availability.full; 
        await modifyDate.run(date.dateId, omit(date, 'dateId'));

        const booking = await this.createBooking.runBookingNoPayment(
          bookingInputFields
        );
        return res.json(booking);
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(500).json({ error: 'Internal server error. ' });
        }
    }
  }

  async createBookingWithPaymentFunction(req: Request, res: Response) {
    const paramId = req.params.id;
    const userId = req.userToken?.userId;
    if (userId !== paramId) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const bookingInputFields = req.body as BookingPaymentInputSchema;
    try {
      const date = await findDate.runDateByDate(
        bookingInputFields.bookingDate, bookingInputFields.siteId);
      
      if(!date || date.dateAvailability === Availability.full) {
        return res.status(400).json({ error: 'Date for this site already occupied.' });
      } else {
        date.dateAvailability = Availability.full; 
        await modifyDate.run(date.dateId, omit(date, 'dateId'));

        const booking = await this.createBooking.runBookingWithPayment(
          bookingInputFields
        );
        return res.json(booking);
      }
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(500).json({ error: 'Internal server error. ' });
        }
    }
  }

  async modifyBookingFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    const userId = req.userToken?.userId;
    if (!role) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const bookingId = req.params.id;
    const bookingInputFields = req.body as BookingModificationSchema;

    try {
      const originalBooking = 
      await this.findBooking.runGetBooking(
        bookingId, true, false, false);

      if(role !== Roles.admin.toString() && 
      originalBooking.userId !== userId) {
        return res.status(401).json({ error: 'Unauthorized access.' });
      }

      if(role !== Roles.admin.toString()) {
        if(!checkTimeRemaining(originalBooking.bookingDate, options.timeLimit)) {
          return res.status(400).json({ error: 'Time limit surpassed. Can not modify booking'});
        }
      }
      const date = await findDate.runDateByDate(
        originalBooking.bookingDate, originalBooking.siteId);
      
      if(!date) return res.status(400).json({ error: 'Something went wrong...'});
      

      const newDateToCheck = await findDate.runDateByDate(
        bookingInputFields.bookingDate, originalBooking.siteId
      );
      if(!newDateToCheck || newDateToCheck.dateAvailability === Availability.full) {
        return res.status(400).json({ error: 'Date already occupied'});
      }
      newDateToCheck.dateAvailability = Availability.full;
      date.dateAvailability = Availability.available;
      await modifyDate.run(newDateToCheck.dateId, omit(newDateToCheck, 'dateId'));
      await modifyDate.run(date.dateId, omit(date, 'dateId'));

      const modifiedBooking = await this.modifyBooking.run(
        bookingId, bookingInputFields
      );
      return res.json(modifiedBooking);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async deleteBookingFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    const userId = req.userToken?.userId;
    if (!role) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }
    const bookingId = req.params.id;

    try {
      const originalBooking = 
      await this.findBooking.runGetBooking(
        bookingId, true, false, false);

      if(role !== Roles.admin.toString() && 
      originalBooking.userId !== userId) {
        return res.status(401).json({ error: 'Unauthorized access.' });
      }

      if(role !== Roles.admin.toString()) {
        if(!checkTimeRemaining(originalBooking.bookingDate, options.timeLimit)) {
          return res.json(400).json({ error: 'Time limit surpassed. Can not modify booking'});
        }
      }

      const date = await findDate.runDateByDate(
        originalBooking.bookingDate, originalBooking.siteId);
      console.log(date);
      if(!date) return res.status(400).json({ error: 'Something went wrong...'});
      date.dateAvailability = Availability.available;
      await modifyDate.run(date.dateId, omit(date, 'dateId'));

      const deletedStatus = await this.deleteBooking.run(bookingId);
      return res.json({ deletedStatus: deletedStatus});
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async initiatePayment(req: Request, res: Response) {
    const { amount, currency, description } = req.body as PaymentSchema;
    if (!amount || !currency || !description) {
      return res.status(400).json({ message: 'Amount, currency, and description are required' });
    }
  
    try {
      const paymentIntent = 
      await createPaymentIntent(amount, currency, description);
      return res.json({
        bookingPaymentId: paymentIntent.id,
        bookingPaymentDate: new Date(paymentIntent.created),
        bookingPrice: paymentIntent.amount,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: unknown) {
      if(error instanceof Error)
        return res.status(500).json({ message: error.message });
      else
        return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  async fetchPayment(req: Request, res: Response) {
    const { paymentIntentId } = req.params;
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment Intent ID is required' });
    }
  
    try {
      const paymentIntent = await getPaymentIntent(paymentIntentId);
      return res.json(paymentIntent);
    } catch (error: unknown) {
      if(error instanceof Error)
        return res.status(500).json({ message: error.message });
      else
        return res.status(500).json({ message: 'Internal server error' });
    }
  };

  async cancelPaymentFunction(req: Request, res: Response) {
    const bookingId = req.params.bookingId;
    const { paymentIntentId } = req.body as RefundPaymentSchema;
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }

    const booking = await this.findBooking.runGetBooking(
      bookingId, false, false, false
    );
    if(!booking) return res.json(404).json({ error: 'Booking not found'});

    if(!checkTimeRemaining(booking.bookingDate, options.timeLimit)) {
      return res.json(400).json({ error: 'Time limit surpassed.'});
    }
    try {
      const paymentIntent = await cancelPayment(paymentIntentId);
      return res.json({
        success: true,
        message: 'Payment cancelled successfully',
        paymentIntent,
      });
    } catch (error: unknown) {
      if(error instanceof Error)
        return res.status(500).json({ message: error.message });
      else
        return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async refundPaymentFunction(req: Request, res: Response) {
    const bookingId = req.params.bookingId;
    const { paymentIntentId, amount } = req.body as RefundPaymentSchema;
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'PaymentIntent ID is required' });
    }
  
    const booking = await this.findBooking.runGetBooking(
      bookingId, false, false, false
    );
    if(!booking) return res.json(404).json({ error: 'Booking not found'});

    if(!checkTimeRemaining(booking.bookingDate, options.timeLimit)) {
      return res.json(400).json({ error: 'Time limit surpassed.'});
    }

    try {
      const refund = await createRefunds(paymentIntentId, amount);
      return res.json({
        success: true,
        message: 'Payment refunded successfully',
        refund,
      });
    } catch (error: unknown) {
      if(error instanceof Error)
        return res.status(500).json({ message: error.message });
      else
        return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
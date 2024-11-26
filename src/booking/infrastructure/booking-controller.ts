import { CreateBooking } from "../application/create-booking";
import { DeleteBooking } from "../application/delete-booking";
import { FindBooking } from "../application/find-booking";
import { ModifyBooking } from "../application/modify-booking";
import { UserForToken } from "../../user/domain/user";
import { Availability } from "../domain/booking";
import { BookingSchema } from "./booking-schema";
import { checkAppointment, modifyAppointment } from "../../date/infrastructure/dependencies";
import { AppointmentInputFields } from "../../date/domain/appointment";
import options from "../../ztools/config";

import { Request, Response } from "express";
import jwt from 'jsonwebtoken';


export class BookingController {
  constructor(
    private readonly findBooking: FindBooking,
    private readonly createBooking: CreateBooking,
    private readonly modifyBooking: ModifyBooking,
    private readonly deleteBooking: DeleteBooking,
  ) { }

  async getBookingFunction(req: Request, res: Response) {
    const bookingId = Number(req.params.id);
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    try {
      const booking = await this.findBooking.runGetBooking(bookingId);

      if (decodedToken.userId !== booking.bookingFields.userRef.userId || decodedToken.role !== 'admin') return res.status(401).json({ error: 'Unauthorized access' });
      else return res.json(booking);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async getBookingsFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (!decodedToken.role) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    try {
      const bookings = await this.findBooking.runGetBookings();
      if(decodedToken.role === 'admin') return res.json(bookings);
      else {
        const userBookings = bookings.filter(booking => booking.bookingFields.userRef.userId === decodedToken.userId);
        return res.json(userBookings);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async createBookingFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.userId !== Number(req.params.id)) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const bookingInputFields = req.body as BookingSchema;
    try {
      const appointment = await checkAppointment.run(bookingInputFields.bookingDate);
      if(appointment.appointmentFields.appointmentAvailiability !== Availability.available) {
        return res.status(400).json({ error: 'Date specified already taken. '});
      }

      const modifiedAppointment : AppointmentInputFields = {
        appointmentDate: bookingInputFields.bookingDate,
        appointmentAvailability: Availability.full,
        siteId: appointment.appointmentFields.siteRef.siteId
      };

      const returnedBooking = await this.createBooking.run(bookingInputFields);
      await modifyAppointment.run(appointment.appointmentFields.appointmentId, modifiedAppointment);

      return res.json(returnedBooking);
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(500).json({ error: 'Internal server error. ' });
        }
    }
  }

  async modifyBookingFunction(req: Request, res: Response) {
    const bookingId = Number(req.params.id);
    const BookingInputFields = req.body as BookingSchema;

    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.userId !== BookingInputFields.userId || decodedToken.role !== 'admin')
      return res.status(401).json({ error: 'Unauthorized access.' });

    try {
      const originalBooking = await this.findBooking.runGetBooking(bookingId);
      const appointment = await checkAppointment.run(BookingInputFields.bookingDate);

      if(appointment.appointmentFields.appointmentAvailiability != Availability.available) {
        return res.status(400).json({ error: 'Date specified already taken. '});
      }

      const modifiedAppointment : AppointmentInputFields = {
        appointmentDate: BookingInputFields.bookingDate,
        appointmentAvailability: Availability.full,
        siteId: appointment.appointmentFields.siteRef.siteId
      };

      const modifiedBooking = await this.modifyBooking.run(bookingId, BookingInputFields);
      const originalAppointment = await checkAppointment.run(originalBooking.bookingFields.bookingDate);

      await modifyAppointment.run(
        originalAppointment.appointmentFields.appointmentId, 
        {
          appointmentDate: originalBooking.bookingFields.bookingDate, 
          appointmentAvailability: Availability.available, 
          siteId: originalAppointment.appointmentFields.siteRef.siteId
        });

      await modifyAppointment.run(appointment.appointmentFields.siteRef.siteId, modifiedAppointment);
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
    const bookingId = Number(req.params.id);
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    try {
      const booking = await this.findBooking.runGetBooking(bookingId);
      const date = booking.bookingFields.bookingDate;

      if (decodedToken.userId !== booking.bookingFields.userRef.userId || decodedToken.role !== 'admin') return res.status(401).json({ error: 'Unauthorized access.' });

      const appointment = await checkAppointment.run(booking.bookingFields.bookingDate);
      const deletedStatus = await this.deleteBooking.run(bookingId);

      await modifyAppointment.run(
        appointment.appointmentFields.siteRef.siteId, 
        { 
          appointmentDate: date, 
          appointmentAvailability: Availability.available,
          siteId: appointment.appointmentFields.siteRef.siteId
        });
      return res.json({ status: deletedStatus });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }
}
import { CreateBooking } from "../application/create-booking";
import { DeleteBooking } from "../application/delete-booking";
import { FindBooking } from "../application/find-booking";
import { ModifyBooking } from "../application/modify-booking";
import { UserForToken } from "../../user/domain/user";
import options from "../../config";
import { BookingSchema } from "./booking-schema";

import { checkAppointment, modifyAppointment } from "../../appointment/infrastructure/dependencies";
import { AppointmentFieldsNoId } from "../../appointment/domain/appointment";

import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { Availability } from "../domain/booking";

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
      if (decodedToken.userId === booking.bookingFields.userIdRef || decodedToken.role === 'admin') return res.json(booking);
      else return res.status(401).json({ error: 'Unauthorized access' });
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

    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    try {
      const bookings = await this.findBooking.runGetBookings();
      return res.json(bookings);
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

    const bookingFieldsNoId = req.body as BookingSchema;
    
    try {
      const appointment = await checkAppointment.run(bookingFieldsNoId.bookingDate);

      if(appointment[1] != Availability.available) {
        return res.status(400).json({ error: 'Date specified already taken. '});
      }

      const modifiedAppointment : AppointmentFieldsNoId = {
        appointmentDate: bookingFieldsNoId.bookingDate,
        appointmentDisponibility: Availability.full
      };

      const returnedBooking = await this.createBooking.run(bookingFieldsNoId);

      await modifyAppointment.run(appointment[0], modifiedAppointment);
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
    const bookingFieldsNoId = req.body as BookingSchema;

    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.userId !== bookingFieldsNoId.userIdRef || decodedToken.role !== 'admin')
      return res.status(401).json({ error: 'Unauthorized access.' });

    try {
      const originalBooking = await this.findBooking.runGetBooking(bookingId);

      const appointment = await checkAppointment.run(bookingFieldsNoId.bookingDate);

      if(appointment[1] != Availability.available) {
        return res.status(400).json({ error: 'Date specified already taken. '});
      }

      const modifiedAppointment : AppointmentFieldsNoId = {
        appointmentDate: bookingFieldsNoId.bookingDate,
        appointmentDisponibility: Availability.full
      };

      const modifiedBooking = await this.modifyBooking.run(bookingId, bookingFieldsNoId);

      const originalAppointment = await checkAppointment.run(originalBooking.bookingFields.bookingDate);

      await modifyAppointment.run(originalAppointment[0], {appointmentDate: originalBooking.bookingFields.bookingDate, appointmentDisponibility: Availability.available});
      await modifyAppointment.run(appointment[0], modifiedAppointment);

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

      if (decodedToken.userId !== booking.bookingFields.userIdRef || decodedToken.role !== 'admin') return res.status(401).json({ error: 'Unauthorized access.' });

      const appointment = await checkAppointment.run(booking.bookingFields.bookingDate);
      
      const deletedStatus = await this.deleteBooking.run(bookingId);

      await modifyAppointment.run(appointment[0], { appointmentDate: date, appointmentDisponibility: Availability.available });
      
      return res.json({ status: deletedStatus });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async checkAvailabilityFunction(_req: Request, _res: Response) {
    //TODO
  }
}
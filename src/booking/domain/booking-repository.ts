import { Booking, BookingInputFields } from "./booking";

export interface BookingRepository {
  getBooking(bookingId: number): Promise<Booking | null>;

  getBookings(): Promise<Booking[] | null>;

  createBooking(bookingInputFields: BookingInputFields): Promise<Booking | null>;

  modifyBooking(bookingId: number, bookingInputFields: Partial<BookingInputFields>): Promise<Booking>;

  deleteBooking(bookingId: number): Promise<number>;
}
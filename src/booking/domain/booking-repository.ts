import { Booking, BookingFieldsNoId } from "./booking";

export interface BookingRepository {
  getBooking(bookingId: number): Promise<Booking | null>;

  getBookings(): Promise<Booking[] | null>;

  createBooking(bookingFieldsNoId: BookingFieldsNoId): Promise<Booking>;

  modifyBooking(bookingId: number, bookingFieldsNoId: Partial<BookingFieldsNoId>): Promise<Booking>;

  deleteBooking(bookingId: number): Promise<number>;
}
import { Booking } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";


export class FindBooking {
  constructor(private readonly bookingRespository: BookingRepository) { }

  async runGetBooking(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRespository.getBooking(bookingId);
    if (!booking) throw new Error('Booking not found.');
    else return booking;
  }

  async runGetBookings(): Promise<Booking[]> {
    const bookings = await this.bookingRespository.getBookings();
    if (!bookings) throw new Error('Booking list empty.');
    else return bookings;
  }
}
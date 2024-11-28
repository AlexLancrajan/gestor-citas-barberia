import { BookingFields } from "../domain/booking";
import { BookingQueryParams, BookingRepository } from "../domain/booking-repository";


export class FindBooking {
  constructor(private readonly bookingRespository: BookingRepository) { }

  async runGetBooking(
    bookingId: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields> {
    const booking = await this.bookingRespository.getBooking(
      bookingId, getUser, getSite, getService
    );

    if (!booking) throw new Error('Booking not found.');

    else return booking;
  }

  async runGetBookingsForAdmin(
    bookingQuery: BookingQueryParams
  ): Promise<BookingFields[]> {
    const bookings = 
    await this.bookingRespository.getBookingsForAdmin(bookingQuery);

    if (!bookings) throw new Error('Booking list empty.');

    else return bookings;
  }

  async runGetBookingsForUser(
    bookingUserId: number,
    page: number,
    pageSize: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields[]> {
    const bookings = 
    await this.bookingRespository.getBookingsForUser(
      bookingUserId, page, pageSize, getUser, getSite, getService
    );

    if (!bookings) throw new Error('Booking list empty.');

    else return bookings;
  }
}
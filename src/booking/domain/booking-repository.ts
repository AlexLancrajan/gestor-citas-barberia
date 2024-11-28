import { BookingFields, BookingInputFields } from "./booking";

export interface BookingQueryParams {
  bookingDate?: Date,
  bookingUserId?: number,
  bookingSiteId?: number,
  bookingServiceId?: number,
  getUsers?: boolean,
  getSites?: boolean,
  getServices?: boolean,
  page?: number,
  pageSize?: number,
}


export interface BookingRepository {
  getBooking(
    bookingId: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields | null>;

  getBookingsForAdmin(
    bookingQuery: BookingQueryParams
  ): Promise<BookingFields[] | null>;

  getBookingsForUser(
    bookingUserId: number,
    page: number,
    pageSize: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields[] | null>;

  createBookingNoPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields>;

  createBookingWithPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields>;

  modifyBooking(
    bookingId: number,
    bookingInputFields: Partial<BookingInputFields>
  ): Promise<BookingFields>;

  deleteBooking(bookingId: number): Promise<number>;
}
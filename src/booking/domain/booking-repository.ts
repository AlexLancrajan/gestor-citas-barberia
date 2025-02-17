import { BookingFields, BookingInputFields } from "./booking";

export interface BookingQueryParams {
  bookingDate?: Date,
  userId?: string,
  siteId?: number,
  serviceId?: number,
  getUsers?: boolean,
  getSites?: boolean,
  getServices?: boolean,
  page?: number,
  pageSize?: number,
}


export interface BookingRepository {
  getBooking(
    bookingId: string,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields | null>;

  getBookingsForAdmin(
    bookingQuery: BookingQueryParams
  ): Promise<BookingFields[] | null>;

  getBookingsForUser(
    userId: string,
    page: number,
    pageSize: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields[] | null>;

  createBookingNoPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields>;

  modifyBooking(
    bookingId: string,
    bookingInputFields: Partial<BookingInputFields>
  ): Promise<BookingFields>;

  modifyBookingWebhook(
    bookingId: string, paymentStatus: string
  ): Promise<BookingFields>;

  deleteBooking(bookingId: string): Promise<number>;
}
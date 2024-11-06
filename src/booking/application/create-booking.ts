import { Booking, BookingFieldsNoId } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";


export class CreateBooking {
  constructor(private readonly bookingRepository: BookingRepository) { }

  async run(bookingFieldsNoId: BookingFieldsNoId): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.createBooking(bookingFieldsNoId);
      return booking;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
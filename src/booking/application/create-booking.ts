import { Booking, BookingInputFields } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";


export class CreateBooking {
  constructor(private readonly bookingRepository: BookingRepository) { }

  async run(bookingInputFields: BookingInputFields): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.createBooking(bookingInputFields);
      if(!booking) throw new Error('Booking not found.');
      else return booking;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
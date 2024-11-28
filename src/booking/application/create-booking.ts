import { BookingFields, BookingInputFields } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";


export class CreateBooking {
  constructor(private readonly bookingRepository: BookingRepository) { }

  async runBookingNoPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields> {
    try {
      const booking = 
      await this.bookingRepository.createBookingNoPayment(bookingInputFields);

      if(!booking) 
        throw new Error('Booking not found.');
      else 
        return booking;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }

  async runBookingWithPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields> {
    try {
      const booking = 
      await this.bookingRepository.createBookingWithPayment(bookingInputFields);

      if(!booking) 
        throw new Error('Booking not found.');
      else 
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
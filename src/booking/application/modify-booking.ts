import { BookingFields, BookingInputFields } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";


export class ModifyBooking {
  constructor(private readonly bookingRepository: BookingRepository) { }

  async run(
    bookingId: number, bookingInputFields: Partial<BookingInputFields>
  ): Promise<BookingFields> {
    try {
      const booking = 
      await this.bookingRepository.modifyBooking(
        bookingId, bookingInputFields
      );
      
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
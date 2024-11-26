import { BookingRepository } from "../domain/booking-repository";


export class DeleteBooking {
  constructor(private readonly bookingRepository: BookingRepository) { }

  async run(bookingId: number): Promise<number | string> {
    const deletedStatus = await this.bookingRepository.deleteBooking(bookingId);
    if (deletedStatus === 0) return 'User already delted';
    else return deletedStatus;
  }
}
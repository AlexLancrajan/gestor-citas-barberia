import { mySQLBooking, mySQLService, mySQLSite, mySQLUser } from "../../mySQL";
import { Booking, BookingInputFields } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";

export class mySQLBookingRepository implements BookingRepository {
  async getBooking(bookingId: number): Promise<Booking | null> {
    const booking = await mySQLBooking.findByPk(bookingId, { include: [mySQLUser, mySQLService, mySQLSite], attributes: { exclude: ['appointmentId']} });
    return booking ? new Booking(booking.toJSON()) : null;
  }

  async getBookings(): Promise<Booking[] | null> {
    const bookings = await mySQLBooking.findAll({ include: [mySQLUser, mySQLService, mySQLSite], attributes: { exclude: ['appointmentId']} });
    return bookings ? bookings.map(booking => new Booking(booking.toJSON())) : null;
  }

  async createBooking(bookingInputFields: BookingInputFields): Promise<Booking | null> {
    const newBooking = await mySQLBooking.create(
      {
        bookingDate: bookingInputFields.bookingDate,
        bookingAvailability: bookingInputFields.bookingAvailability,
        bookingAnnotations: bookingInputFields.bookingAnnotations,
        userId: bookingInputFields.userId,
        serviceId: bookingInputFields.serviceId,
        siteId: bookingInputFields.siteId,
        appointmentId: bookingInputFields.appointmentId,
        paymentId: bookingInputFields.paymentId
      }
    ); 
    return (newBooking) ? new Booking(newBooking.toJSON()) : null;
  }
  async modifyBooking(bookingId: number, bookingInputFields: Partial<BookingInputFields>): Promise<Booking> {
    const foundBooking = await mySQLBooking.findByPk(bookingId);
    if(!foundBooking) throw new Error('Booking not found');

    const modifiedBookingData: BookingInputFields = {...foundBooking.toJSON(), ...bookingInputFields};
    await mySQLBooking.update(modifiedBookingData, { where: { bookingId: bookingId }});

    const modifiedBooking = await mySQLBooking.findByPk(bookingId);
    if(!modifiedBooking) throw new Error('Could not modify the booking. ');
    else return new Booking(modifiedBooking.toJSON());
  }
  async deleteBooking(bookingId: number): Promise<number> {
    const deletedBooking = await mySQLBooking.destroy({ where: { bookingId: bookingId } });
    return deletedBooking;
  }
}
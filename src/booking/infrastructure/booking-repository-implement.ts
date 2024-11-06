import { DataTypes, Model, Sequelize } from "sequelize";
import { Availability, Booking, BookingFieldsNoId } from "../domain/booking";
import { BookingRepository } from "../domain/booking-repository";

class BookingImplementation extends Model { }

const initBookingModel = (sequelize: Sequelize) => {
  BookingImplementation.init(
    {
      bookingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
      },
      disponibility: {
        type: DataTypes.ENUM(
          Availability.available.toString(),
          Availability.highlyOccupied.toString(),
          Availability.full.toString()
        ),
        allowNull: false
      },
      annotations: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Booking'
    });
};

export class mySQLBookingRepository implements BookingRepository {
  constructor(sequelize: Sequelize) {
    try {
      initBookingModel(sequelize);
      BookingImplementation.sync().catch(console.error);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  async getBooking(bookingId: number): Promise<Booking | null> {
    const booking = await BookingImplementation.findByPk(bookingId);

    if (booking) return booking.toJSON();

    else return null;
  }
  async getBookings(): Promise<Booking[] | null> {
    const bookings = await BookingImplementation.findAll();

    if (bookings) return bookings.map(booking => new Booking(booking.toJSON()));

    else return null;
  }
  async createBooking(bookingFieldsNoId: BookingFieldsNoId): Promise<Booking> {
    const newBooking = await BookingImplementation.create(
      {
        bookingDate: bookingFieldsNoId.bookingDate,
        disponibility: bookingFieldsNoId.disponibility,
        annotations: bookingFieldsNoId.annotations
      }
    );

    if (newBooking) {
      return newBooking.toJSON();
    } else {
      throw new Error('Could not create the booking.');
    }
  }
  async modifyBooking(bookingId: number, bookingFieldsNoId: Partial<BookingFieldsNoId>): Promise<Booking> {
    const findBooking = await BookingImplementation.findByPk(bookingId);

    if (findBooking) {
      const originalBooking: Booking = new Booking(findBooking.toJSON());
      const modifiedBooking = await BookingImplementation.update(
        {
          bookingDate: bookingFieldsNoId.bookingDate || originalBooking.bookingFields.bookingDate,
          disponibility: bookingFieldsNoId.disponibility || originalBooking.bookingFields.disponibility,
          annotations: bookingFieldsNoId.annotations || originalBooking.bookingFields.annotations,
        },
        { where: { BookingId: bookingId } }
      );

      if (modifiedBooking) {
        const newBooking = await BookingImplementation.findByPk(bookingId);

        if (newBooking) return newBooking.toJSON();
        else throw new Error('Modified Booking not Found');
      } else {
        throw new Error('Could not modify the Booking');
      }
    } else {
      throw new Error('Booking not found');
    }
  }
  async deleteBooking(bookingId: number): Promise<number> {
    const deletedBooking = await BookingImplementation.destroy({ where: { bookingId: bookingId } });
    return deletedBooking;
  }
}
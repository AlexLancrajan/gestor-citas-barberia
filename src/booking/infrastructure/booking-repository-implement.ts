import { Includeable } from "sequelize";
import { mySQLBooking, mySQLService, mySQLSite, mySQLUser } from "../../mySQL";
import { BookingFields, BookingInputFields } from "../domain/booking";
import { BookingQueryParams, BookingRepository } from "../domain/booking-repository";

export class mySQLBookingRepository implements BookingRepository {
  async getBooking(
    bookingId: string,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields | null> {
    const includeOptions: Includeable[] = [];

    if(getUser) {
      includeOptions.push(mySQLUser);
    }
    if(getSite) {
      includeOptions.push(mySQLSite);
    }
    if(getService) {
      includeOptions.push(mySQLService);
    }

    const booking = 
    await mySQLBooking.findByPk(bookingId,
      {
        include: includeOptions,
        attributes: { 
          exclude: ['createdAt', 'updatedAt']
        } 
      }
    );

    if(!booking) 
      return null;
    else
      return booking.toJSON();
  }

  async getBookingsForAdmin(
    bookingQuery: BookingQueryParams
  ): Promise<BookingFields[] | null> {
    const includeOptions: Includeable[] = [];

    if(bookingQuery.getUsers) {
      includeOptions.push(mySQLUser);
    }
    if(bookingQuery.getSites) {
      includeOptions.push(mySQLSite);
    }
    if(bookingQuery.getServices) {
      includeOptions.push(mySQLService);
    }

    const whereClause: Record<string, unknown> = {};

    if(typeof bookingQuery.bookingDate !== 'undefined') {
      whereClause.bookingDate = bookingQuery.bookingDate;
    }
    if(typeof bookingQuery.userId !== 'undefined') {
      whereClause.userId = bookingQuery.userId;
    }
    if(typeof bookingQuery.siteId !== 'undefined') {
      whereClause.siteId = bookingQuery.siteId;
    }
    if(typeof bookingQuery.userId !== 'undefined') {
      whereClause.serviceId = bookingQuery.serviceId;
    }

    const bookings = 
    await mySQLBooking.findAll({
      where: whereClause,
      include: includeOptions,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      limit: bookingQuery.pageSize || 50,
      offset: bookingQuery.page || 0
    });

    if(!bookings)
      return null;
    else
      return bookings.map(booking => booking.toJSON());
  }

  async getBookingsForUser(
    userId: string, 
    page: number,
    pageSize: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean,
  ): Promise<BookingFields[] | null> {
    const includeOptions: Includeable[] = [];

    if(getUser) {
      includeOptions.push(mySQLUser);
    }
    if(getSite) {
      includeOptions.push(mySQLSite);
    }
    if(getService) {
      includeOptions.push(mySQLService);
    }

    const bookings = 
    await mySQLBooking.findAll({
      where: {
        userId: userId
      },
      include: includeOptions,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      limit: pageSize || 50,
      offset: page || 0
    });

    if(!bookings)
      return null;
    else
      return bookings.map(booking => booking.toJSON());
  }

  async createBookingNoPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields> {
    const newBooking = await mySQLBooking.create({
      bookingDate: bookingInputFields.bookingDate,
      bookingAnnotations: bookingInputFields.bookingAnnotations,
      userId: bookingInputFields.userId,
      siteId: bookingInputFields.siteId,
      serviceId: bookingInputFields.serviceId
    });

    if(!newBooking)
      throw new Error('Could not create the booking.');
    else {
      return newBooking.toJSON();
    }
  }

  async createBookingWithPayment(
    bookingInputFields: BookingInputFields
  ): Promise<BookingFields> {
    const newBooking = await mySQLBooking.create({
      bookingDate: bookingInputFields.bookingDate,
      bookingAnnotations: bookingInputFields.bookingAnnotations,
      bookingTransactionId: bookingInputFields.bookingTransactionId,
      bookingPaymentDate: bookingInputFields.bookingPaymentDate,
      bookingPrice: bookingInputFields.bookingPrice,
      bookingUserId: bookingInputFields.userId,
      bookingSiteId: bookingInputFields.siteId,
      bookingServiceId: bookingInputFields.serviceId
    });

    if(!newBooking)
      throw new Error('Could not create the booking.');
    else {
      return newBooking.toJSON();
    }
  }

  async modifyBooking(
    bookingId: string, 
    bookingInputFields: Partial<BookingInputFields>
  ): Promise<BookingFields> {
    const foundBooking = await mySQLBooking.findByPk(bookingId);
    if(!foundBooking) throw new Error('Booking not found');

    const modifiedBookingData: BookingInputFields = {...foundBooking.toJSON(), ...bookingInputFields};
    await mySQLBooking.update(modifiedBookingData, { where: { bookingId: bookingId }});

    const modifiedBooking = await mySQLBooking.findByPk(bookingId);
    if(!modifiedBooking) throw new Error('Could not modify the booking. ');
    else return modifiedBooking.toJSON();
  }
  
  async deleteBooking(bookingId: string): Promise<number> {
    const deletedBooking = 
    await mySQLBooking.destroy({ where: { bookingId: bookingId } });

    return deletedBooking;
  }
}
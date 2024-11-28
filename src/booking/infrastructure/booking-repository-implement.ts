import { Includeable } from "sequelize";
import { mySQLBooking, mySQLService, mySQLSite, mySQLUser } from "../../mySQL";
import { BookingFields, BookingInputFields } from "../domain/booking";
import { BookingQueryParams, BookingRepository } from "../domain/booking-repository";

export class mySQLBookingRepository implements BookingRepository {
  async getBooking(
    bookingId: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean
  ): Promise<BookingFields | null> {
    const references: Includeable[] = [];
    if(getUser)
      references.push(mySQLUser);
    if(getSite)
      references.push(mySQLSite);
    if(getService)
      references.push(mySQLService);

    const booking = 
    await mySQLBooking.findByPk(bookingId,
      {
        include: references, 
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
    const references: Includeable[] = [];
    if(bookingQuery.getUsers)
      references.push(mySQLUser);
    if(bookingQuery.getSites)
      references.push(mySQLSite);
    if(bookingQuery.getServices)
      references.push(mySQLService);

    const bookings = 
    await mySQLBooking.findAll({
      where: {
        bookingDate: bookingQuery.bookingDate,
        bookingUserId: bookingQuery.bookingUserId,
        bookingSiteId: bookingQuery.bookingSiteId,
        bookingServiceId: bookingQuery.bookingServiceId
      },
      include: references,
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
    bookingUserId: number, 
    page: number,
    pageSize: number,
    getUser: boolean,
    getSite: boolean,
    getService: boolean,
  ): Promise<BookingFields[] | null> {
    const references: Includeable[] = [];
    if(getUser)
      references.push(mySQLUser);
    if(getSite)
      references.push(mySQLSite);
    if(getService)
      references.push(mySQLService);

    const bookings = 
    await mySQLBooking.findAll({
      where: {
        bookingUserId: bookingUserId
      },
      include: references,
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
      bookingUserId: bookingInputFields.userIdRef,
      bookingSiteId: bookingInputFields.siteIdRef,
      bookingServiceId: bookingInputFields.serviceIdRef
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
      bookingUserId: bookingInputFields.userIdRef,
      bookingSiteId: bookingInputFields.siteIdRef,
      bookingServiceId: bookingInputFields.serviceIdRef
    });

    if(!newBooking)
      throw new Error('Could not create the booking.');
    else {
      return newBooking.toJSON();
    }
  }

  async modifyBooking(
    bookingId: number, 
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
  
  async deleteBooking(bookingId: number): Promise<number> {
    const deletedBooking = 
    await mySQLBooking.destroy({ where: { bookingId: bookingId } });

    return deletedBooking;
  }
}
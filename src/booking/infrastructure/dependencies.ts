import { CreateBooking } from '../application/create-booking';
import { DeleteBooking } from '../application/delete-booking';
import { FindBooking } from "../application/find-booking";
import { ModifyBooking } from '../application/modify-booking';
import { BookingController } from './booking-controller';
import { mySQLBookingRepository } from './booking-repository-implement';


const bookingRepository = new mySQLBookingRepository();

const findBooking = new FindBooking(bookingRepository);

const createBooking = new CreateBooking(bookingRepository);

export const modifyBooking = new ModifyBooking(bookingRepository);

const deleteBooking = new DeleteBooking(bookingRepository);


export const bookingController = new BookingController(
  findBooking,
  createBooking,
  modifyBooking,
  deleteBooking,
);
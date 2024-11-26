import { ServiceFields } from "../../service/domain/service";
import { SiteFields } from "../../site/domain/site";
import { UserFields } from "../../user/domain/user";

export enum Availability {
  available,
  highlyOccupied,
  full
}

export interface BookingInputFields {
  bookingDate: Date,
  bookingAvailability: Availability,
  bookingAnnotations?: string,
  userId: number,
  serviceId: number,
  siteId: number,
  appointmentId: number,
  paymentId: number
}

export interface BookingFields {
  bookingId: number,
  bookingDate: Date,
  bookingAvailability: Availability,
  bookingAnnotations?: string,
}

export interface BookingDBFields {
  bookingId: number,
  bookingDate: Date,
  bookingDisponibility: Availability,
  bookingAnnotations?: string,
  userRef: UserFields,
  serviceRef: ServiceFields,
  siteRef: SiteFields,
}

export class Booking {
  constructor(readonly bookingFields: BookingDBFields) { }
}
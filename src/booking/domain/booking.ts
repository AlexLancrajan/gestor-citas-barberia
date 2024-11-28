import { ServiceFields } from "../../service/domain/service";
import { SiteFields } from "../../site/domain/site";
import { UserFields } from "../../user/domain/user";

export enum Availability {
  available,
  lowOccupied,
  mediumOccupied,
  highlyOccupied,
  full
}

export interface BookingInputFields {
  bookingDate: Date,
  bookingAvailability: Availability,
  bookingAnnotations?: string,
  bookingTransactionId?: string,
  bookingPaymentDate?: Date,
  bookingPrice?: number,
  userIdRef: number,
  siteIdRef: number,
  serviceIdRef: number,
}

export interface BookingFields extends BookingInputFields {
  bookingId: number,
  userRef?: UserFields,
  siteRef?: SiteFields,
  serviceRef?: ServiceFields,
}
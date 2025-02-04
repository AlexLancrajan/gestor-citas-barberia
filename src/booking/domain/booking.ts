import { ServiceFields } from "../../service/domain/service";
import { SiteFields } from "../../site/domain/site";
import { UserFields } from "../../user/domain/user";

export interface BookingInputFields {
  bookingDate: Date,
  bookingAnnotations?: string,
  bookingTransactionId?: string,
  bookingPaymentDate?: Date,
  bookingPrice?: number,
  userId: string,
  siteId: number,
  serviceId: number,
}

export interface BookingFields extends BookingInputFields {
  bookingId: string,
  User?: UserFields,
  Site?: SiteFields,
  Service?: ServiceFields,
}
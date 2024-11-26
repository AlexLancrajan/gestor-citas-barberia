/**
 * Service definition. It has three fields depending on input, reference or DB structure.
 * On input it should be used the InputFields.
 * On ref ServiceFields.
 * On retrieving from DB the DBFields.
 */

import { BookingFields } from "../../booking/domain/booking";
import { SiteFields } from "../../site/domain/site";

export interface ServiceInputFields {
  serviceType: string,
  servicePrice: number,
  serviceDuration: Date,
  serviceDescription: string,
  siteId: number
}

export interface ServiceFields {
  serviceId: number,
  serviceType: string,
  servicePrice: number,
  serviceDuration: Date,
  serviceDescription: string,
}

export interface ServiceDBFields {
  serviceId: number,
  serviceType: string,
  servicePrice: number,
  serviceDuration: Date,
  serviceDescription: string,
  bookingRef: BookingFields[],
  siteRef: SiteFields[]
}

export class Service {
  constructor(readonly serviceFields: ServiceDBFields) { }
}
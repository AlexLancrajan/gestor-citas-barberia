/**
 * Site has three ways of manipulating data.
 * 1. Input: to create or modify the site.
 * 2. SiteFields: to reference this class with the other concepts.
 * 3. DB Fields: to return the full info from DB query.
 * 
 * The returned DB query is a JS Object.
 */

import { AppointmentFields } from "../../date/domain/appointment";
import { BookingFields } from "../../booking/domain/booking";
import { ServiceFields } from "../../service/domain/service";
import { UserFields } from "../../user/domain/user";


export interface SiteInputFields {
  siteName: string,
  siteDirection: string,
  siteSchedule: {
    day: string,
    schedule: Date[]
  }[],
  siteDescription?: string,
}

export interface SiteFields {
  siteId: number,
  siteName: string,
  siteDirection: string,
  siteSchedule: {
    day: string,
    schedule: Date[]
  }[],
  description?: string,
}

export interface SiteDBFields {
  siteId: number,
  siteName: string,
  siteDirection: string,
  siteSchedule: {
    day: string,
    schedule: Date[]
  }[],
  siteDescription?: string,
  appointmentRef: AppointmentFields[],
  bookingRef: BookingFields[],
  serviceRef: ServiceFields[],
  userRef: UserFields[],
}

export class Site {
  constructor(readonly siteFields: SiteDBFields) { }
}
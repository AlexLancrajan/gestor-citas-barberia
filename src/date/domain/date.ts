import { SiteFields } from "../../site/domain/site";

export enum Availability {
  available,
  lowOccupied,
  mediumOccupied,
  highlyOccupied,
  full
}

export interface DateInputFields {
  dateDate: Date,
  dateAvailability: Availability
  siteId: number,
}

export interface DateFields extends DateInputFields{
  dateId: number,
  siteRef?: SiteFields,
}

/**Contains information about open and close time for a particular site. */
export interface ScheduleFields {
  openTime: Date,
  closeTime: Date
}
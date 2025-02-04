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

export interface ScheduleFields {
  initDate: Date,
  endDate: Date
}
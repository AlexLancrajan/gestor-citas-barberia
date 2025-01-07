import { Availability } from "../../booking/domain/booking";
import { SiteFields } from "../../site/domain/site";

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
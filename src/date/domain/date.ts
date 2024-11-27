import { Availability } from "../../booking/domain/booking";
import { SiteFields } from "../../site/domain/site";

export interface DateInputFields {
  dateDate: Date,
  dateAvailability: Availability
  dateSiteIdRef: number,
}

export interface DateFields extends DateInputFields{
  dateId: number,
  dateSiteRef?: SiteFields,
}

export interface ScheduleFields {
  initDate: Date,
  endDate: Date
}
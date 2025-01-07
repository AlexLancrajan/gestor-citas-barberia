import { Availability } from "../../booking/domain/booking";
import { DateFields, DateInputFields, ScheduleFields } from "./date";


export interface DateRepository {

  getDateById(dateId: number, getSite: boolean): 
  Promise<DateFields | null>;
  
  getDateByDate(date: Date, siteId: number): 
  Promise<DateFields | null>;

  getDates(
    siteId: number,
    page: number,
    pageSize: number,
    getSites: boolean
  ): Promise<DateFields[] | null>;
  
  getOccupation(
    siteId: number,
    initDate: Date,
    endDate: Date
  ): Promise<Availability | null>

  createDailyDates(
    siteId: number,
    schedule: ScheduleFields[],
    minutes: number
  ): Promise<void>

  createAutomaticDates(
    initDate: Date,
    months: number, 
    schedule: ScheduleFields[], 
    minutes: number,
    siteId: number
  ): Promise<DateFields[]>;

  createManualDates(
    dateInputFields: DateInputFields[],
  ): Promise<DateFields[]>

  modifyDate(
    dateId: number, 
    dateInputFields: Partial<DateInputFields>
  ): Promise<DateFields>;

  deleteDate(): Promise<number>;
  
  deleteDateById(dateId: number): Promise<number>;

  deleteDatesFromSite(siteId: number): Promise<number>;
}
import { Availability } from "../../booking/domain/booking";
import { DateFields, DateInputFields, ScheduleFields } from "./date";


export interface DateRepository {

  getDateById(dateId: number, getSite: boolean): 
  Promise<DateFields | null>;
  
  getDateByDate(date: Date, siteIdRef: number): 
  Promise<DateFields | null>;

  getDates(
    siteIdRef: number,
    page: number,
    pageSize: number,
    getSites: boolean
  ): Promise<DateFields[] | null>;
  
  getOccupation(
    siteIdRef: number,
    initDate: Date,
    endDate: Date
  ): Promise<Availability | null>

  createDailyDates(
    siteIdRef: number,
    schedule: ScheduleFields[],
    minutes: number
  ): Promise<void>

  createAutomaticDates(
    initDate: Date,
    months: number, 
    schedule: ScheduleFields[], 
    minutes: number,
    siteIdRef: number
  ): Promise<DateFields[]>;

  createManualDates(
    dateInputFields: DateInputFields[],
  ): Promise<DateFields[]>

  modifyDate(
    dateId: number, 
    dateInputFields: Partial<DateInputFields>
  ): Promise<DateFields>;

  deleteDate(): Promise<void>;
  
  deleteDateById(dateId: number): Promise<number>;

  deleteDatesFromSite(siteIdRef: number): Promise<number>;
}
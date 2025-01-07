import { DateFields, DateInputFields, ScheduleFields } from "../domain/date";
import { DateRepository } from "../domain/date-repository";


export class CreateDate {
  constructor(private readonly dateRepository: DateRepository) { }

  async runCreateDailyDates(
    siteId: number,
    schedule: ScheduleFields[],
    minutes: number
  ): Promise<void> {
    try {
      await this.dateRepository.createDailyDates(
        siteId, schedule, minutes);
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Automatic dates for site ${siteId} could not be created.`);
      }
    }
  }

  async runCreateAutomaticDates(
    initDate: Date, 
    months: number, 
    schedule: ScheduleFields[], 
    minutes: number, 
    siteId: number
  ): Promise<DateFields[]> {
    try {
      const dates = 
      await this.dateRepository.createAutomaticDates(
        initDate, months, schedule, minutes, siteId);
      return dates;    
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Automatic dates for site ${siteId} could not be created.`);
      }
    }
  }

  async runCreateManualDates(
    dateInputFields: DateInputFields[]
  ): Promise<DateFields[]> {
    try {
      const dates = 
      await this.dateRepository.createManualDates(dateInputFields);
      return dates;    
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Manual dates for site ${dateInputFields[0].siteId} could not be created.`);
      }
    }
  }
}
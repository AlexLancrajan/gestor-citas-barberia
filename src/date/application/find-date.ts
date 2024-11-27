import { Availability } from "../../booking/domain/booking";
import { DateFields } from "../domain/date";
import { DateRepository } from "../domain/date-repository";


export class FindDate {
  constructor(private readonly dateRepository: DateRepository) { }

  async runDateById(dateId: number, getSite: boolean): Promise<DateFields> {
    const date = await this.dateRepository.getDateById(dateId, getSite);

    if (!date) throw new Error('Date not found.');
    
    else return date;
  }

  async runDateByDate(date: Date, siteIdRef: number): Promise<DateFields> {
    const dateByDate = await this.dateRepository.getDateByDate(date, siteIdRef);
    
    if(!dateByDate) throw new Error('Date not found');

    return dateByDate;
  }

  async runDates(
    siteIdRef: number, page: number, pageSize: number, getSites: boolean
  ): Promise<DateFields[]> {
    const dates = await this.dateRepository.getDates(
      siteIdRef, page, pageSize, getSites);
    
    if (!dates) throw new Error('Date list is empty.');
    
    else return dates;
  }

  async runOccupation(
    siteIdRef: number,
    initDate: Date,
    endDate: Date
  ): Promise<Availability> {
    const availability = await this.dateRepository.getOccupation(
      siteIdRef, initDate, endDate
    );

    if(!availability) throw new Error('Could not get availability');

    return availability;
  }
}
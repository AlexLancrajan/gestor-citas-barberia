import { DateRepository } from "../domain/date-repository";


export class DeleteDate {
  constructor(private readonly dateRepository: DateRepository) { }

  async runAutomaticDeletion(): Promise<number> {
    const deletedDays = await this.dateRepository.deleteDate();
    return deletedDays;
  }

  async runById(dateId: number): Promise<number | string> {
    const deletedStatus = await this.dateRepository.deleteDateById(dateId);
    if (deletedStatus === 0) return 'Date already deleted';
    else return deletedStatus;
  }

  async runBySite(siteId: number): Promise<number | string> {
    const deletedStatus = await this.dateRepository.deleteDatesFromSite(siteId);
    if (deletedStatus === 0) return 'Dates already deleted';
    else if(deletedStatus === -1) return 'Site need to be specified';
    else return deletedStatus;
  }
  
}
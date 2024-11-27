import { DateRepository } from "../domain/date-repository";


export class DeleteDate {
  constructor(private readonly dateRepository: DateRepository) { }

  async runAutomaticDeletion(): Promise<void> {
    await this.dateRepository.deleteDate();
  }

  async runById(dateId: number): Promise<number | string> {
    const deletedStatus = await this.dateRepository.deleteDateById(dateId);
    if (deletedStatus === 0) return 'Date already deleted';
    else return deletedStatus;
  }

  async runBySite(siteIdRef: number): Promise<number | string> {
    const deletedStatus = await this.dateRepository.deleteDatesFromSite(siteIdRef);
    if (deletedStatus === 0) return 'Dates already deleted';
    else return deletedStatus;
  }
  
}
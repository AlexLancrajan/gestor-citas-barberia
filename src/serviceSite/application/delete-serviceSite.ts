import { serviceSiteRepository } from "../domain/serviceSite-repository";


export class DeleteServiceSite { 
  constructor(private readonly serviceSiteRepository: serviceSiteRepository) { }

  async run(serviceId: number, siteId: number): Promise<number | string> {
    const deletedStatus = await this.serviceSiteRepository.deleteServiceSite(serviceId, siteId);

    if(deletedStatus === 0) return 'serviceSite relation already deleted';

    return deletedStatus;
  }
}
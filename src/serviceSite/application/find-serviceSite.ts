import { serviceSite } from "../domain/serviceSite";
import { serviceSiteRepository } from "../domain/serviceSite-repository";


export class FindServiceSite {
  constructor(private readonly serviceSiteRepository: serviceSiteRepository) { }

  async getServiceSite(serviceId: number | undefined, siteId: number | undefined): Promise<serviceSite | null> {
    const serviceSite = await this.serviceSiteRepository.getServiceSite(serviceId, siteId);

    if(!serviceSite) return null;

    else return serviceSite;
  }

  async getAllServiceSite(page: number, pageSize: number): Promise<serviceSite[] | null> {
    const manyServiceSite = await this.serviceSiteRepository.getAllServiceSite(page, pageSize);

    if(!manyServiceSite) return null;

    else return manyServiceSite;
  }
}
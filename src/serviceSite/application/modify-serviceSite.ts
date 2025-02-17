import { serviceSite } from "../domain/serviceSite";
import { serviceSiteRepository } from "../domain/serviceSite-repository";


export class ModifyServiceSite {
  constructor(private readonly serviceSiteRepository: serviceSiteRepository) { }

  async run(
    serviceId: number,
    siteId: number,
    serviceSiteFields: Partial<serviceSite>): Promise<serviceSite> {
    try {
      const modifiedServiceSite = await this.serviceSiteRepository.modifyServiceSite(
        serviceId, siteId, serviceSiteFields
      );
      return modifiedServiceSite;
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
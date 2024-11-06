import { Site, SiteFieldsNoId } from "../domain/site";
import { SiteRepository } from "../domain/site-repository";


export class CreateSite {

  constructor(private readonly siteRepository: SiteRepository) { }

  async run(siteFieldsNoId: SiteFieldsNoId): Promise<Site> {

    try {
      const createdSite = await this.siteRepository.createSite(siteFieldsNoId);
      return createdSite;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }

}
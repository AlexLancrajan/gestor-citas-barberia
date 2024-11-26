import { Site, SiteInputFields } from "../domain/site";
import { SiteRepository } from "../domain/site-repository";


export class ModifySite {

  constructor(private readonly siteRepository: SiteRepository) { }

  async run(siteId: number, siteInputFields: Partial<SiteInputFields>): Promise<Site> {
    try {
      const modifiedSite = await this.siteRepository.modifySite(siteId, siteInputFields);
      return modifiedSite;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
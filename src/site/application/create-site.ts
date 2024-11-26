import { Site, SiteInputFields } from "../domain/site";
import { SiteRepository } from "../domain/site-repository";


export class CreateSite {

  constructor(private readonly siteRepository: SiteRepository) { }

  async run(siteInputFields: SiteInputFields): Promise<Site> {

    try {
      const createdSite = await this.siteRepository.createSite(siteInputFields);
      if(!createdSite) throw new Error('Could not create the site.');
      else return createdSite;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }

}
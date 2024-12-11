import { SiteFields } from "../domain/site";
import { SiteRepository } from "../domain/site-repository";


export class FindSite {

  constructor(private readonly siteRepository: SiteRepository) { }

  async runGetSite(id: number): Promise<SiteFields> {
    const site = await this.siteRepository.getSite(id);
    if (!site) throw new Error('Site not found');
    return site;

  }

  async runGetSites(page: number, pageSize: number): Promise<SiteFields[]> {
    const sites = await this.siteRepository.getSites(page, pageSize);
    if (!sites) throw new Error('Not sites available');
    return sites;

  }
}

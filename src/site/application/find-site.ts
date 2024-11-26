import { Site } from "../domain/site";
import { SiteRepository } from "../domain/site-repository";


export class FindSite {

  constructor(private readonly siteRepository: SiteRepository) { }

  async runGetSite(id: number): Promise<Site> {
    const site = await this.siteRepository.getSite(id);
    if (!site) throw new Error('Site not found');
    return site;

  }

  async runGetSiteForUsers(id: number): Promise<Site> {
    const site = await this.siteRepository.getSiteForUsers(id);
    if (!site) throw new Error('Site not found');
    return site;

  }

  async runGetSites(): Promise<Site[]> {
    const sites = await this.runGetSites();
    if (!sites) throw new Error('Not sites available');
    return sites;

  }

  async runGetSitesForUsers(): Promise<Site[]> {
    const sites = await this.runGetSitesForUsers();
    if (!sites) throw new Error('Not sites available');
    return sites;

  }
}

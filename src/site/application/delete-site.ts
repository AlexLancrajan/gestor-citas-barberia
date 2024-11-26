import { SiteRepository } from "../domain/site-repository";


export class DeleteSite {

  constructor(private readonly siteRepository: SiteRepository) { }

  async run(id: number): Promise<number | string> {
    const deletedSite = await this.siteRepository.deleteSite(id);
    if (deletedSite === 0) return 'Site already deleted';
    return deletedSite;
  }
}
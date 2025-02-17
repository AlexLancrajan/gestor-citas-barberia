import { serviceSite } from "../domain/serviceSite";
import { serviceSiteRepository } from "../domain/serviceSite-repository";


export class CreateServiceSite {
  constructor(private readonly serviceSiteRepository: serviceSiteRepository) { }

  async run(serviceSiteFields: serviceSite): Promise<serviceSite> {
    try{
      const serviceSite = await this.serviceSiteRepository.createServiceSite(serviceSiteFields); 
      return serviceSite;
    } catch(err: unknown) {
      if(err instanceof Error) {
        throw err;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
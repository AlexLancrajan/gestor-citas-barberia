import { SiteFields, SiteInputFields } from "./site";

/**It contains all the the abstract methods that operates in the site domain. 
 * 
 * It requires admin privileges.
*/
export interface SiteRepository {
  getSite(id: number): Promise<SiteFields | null>;

  getSites(page: number, pageSize: number): Promise<SiteFields[] | null>;

  createSite(siteInputFields: Partial<SiteInputFields>): Promise<SiteFields | null>;

  modifySite(id: number, siteInputFields: Partial<SiteInputFields>): Promise<SiteFields>;

  deleteSite(id: number): Promise<number>;
}
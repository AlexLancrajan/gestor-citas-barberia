/**
 * The following operation are supported in the site domain are:
 * 1. Find site or sites.
 * 2. Create site.
 * 3. Modify site.
 * 4. Delete site.
 */

import { SiteFields, SiteInputFields } from "./site";

export interface SiteRepository {
  getSite(id: number): Promise<SiteFields | null>;

  getSites(page: number, pageSize: number): Promise<SiteFields[] | null>;

  createSite(siteInputFields: Partial<SiteInputFields>): Promise<SiteFields | null>;

  modifySite(id: number, siteInputFields: Partial<SiteInputFields>): Promise<SiteFields>;

  deleteSite(id: number): Promise<number>;
}
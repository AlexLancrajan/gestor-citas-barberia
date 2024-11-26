/**
 * The following operation are supported in the site domain are:
 * 1. Find site or sites.
 * 2. Create site.
 * 3. Modify site.
 * 4. Delete site.
 */

import { Site, SiteInputFields } from "./site";

export interface SiteRepository {
  getSite(id: number): Promise<Site | null>;

  getSiteForUsers(id: number): Promise<Site | null>;

  getSites(): Promise<Site[] | null>;

  getSitesForUsers(): Promise<Site[] | null>;

  createSite(siteInputFields: Partial<SiteInputFields>): Promise<Site | null>;

  modifySite(id: number, siteInputFields: Partial<SiteInputFields>): Promise<Site>;

  deleteSite(id: number): Promise<number>;
}
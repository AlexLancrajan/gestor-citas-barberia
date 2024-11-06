import { Site, SiteFieldsNoId } from "./site";

export interface SiteRepository {
  getSite(id: number): Promise<Site | null>;

  getSites(): Promise<Site[] | null>;

  createSite(siteFieldsNoId: SiteFieldsNoId): Promise<Site>;

  modifySite(id: number, siteFieldsNoId: Partial<SiteFieldsNoId>): Promise<Site>;

  deleteSite(id: number): Promise<number>;
}
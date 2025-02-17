import { serviceSite } from "./serviceSite";

export interface serviceSiteRepository {
  getServiceSite(
    serviceId: number | undefined, 
    siteId: number | undefined): Promise<serviceSite | null>

  getAllServiceSite(page: number, pageSize: number): Promise<serviceSite[] | null>

  createServiceSite(serviceSiteInput: serviceSite): Promise<serviceSite>

  modifyServiceSite(
    serviceId: number, 
    siteId: number,
    serviceSiteInput: Partial<serviceSite>): Promise<serviceSite>
  
  deleteServiceSite(serviceId: number, siteId: number): Promise<number>
}
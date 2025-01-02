/**
 * With service it can be done regular CRUD operations.
 */

import { ServiceFields, ServiceInputFields } from "./service";


export interface ServiceRepository {
  getService(serviceId: number): Promise<ServiceFields | null>;

  getServices(siteId:number|undefined, page:number, pageSize: number): Promise<ServiceFields[] | null>;

  createService(serviceInputFields: ServiceInputFields): Promise<ServiceFields>;

  modifyService(serviceId: number, serviceInputFields: Partial<ServiceInputFields>): Promise<ServiceFields>;

  deleteService(ServiceId: number): Promise<number | string>;
}
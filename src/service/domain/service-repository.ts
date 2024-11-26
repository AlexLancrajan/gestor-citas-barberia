/**
 * With service it can be done regular CRUD operations.
 */

import { Service, ServiceInputFields } from "./service";


export interface ServiceRepository {
  getService(serviceId: number): Promise<Service | null>;

  getServiceForUsers(serviceId: number): Promise<Service | null>;

  getServices(): Promise<Service[] | null>;

  getServicesForUsers(): Promise<Service[] | null>;

  createService(serviceInputFields: ServiceInputFields): Promise<Service | null>;

  modifyService(serviceId: number, serviceInputFields: Partial<ServiceInputFields>): Promise<Service>;

  deleteService(ServiceId: number): Promise<number | string>;
}
import { Service, ServiceFieldsNoId } from "./service";


export interface ServiceRepository {
  getService(ServiceId: number): Promise<Service | null>;

  getServices(): Promise<Service[] | null>;

  createService(serviceFieldsNoId: ServiceFieldsNoId): Promise<Service>;

  modifyService(serviceId: number, serviceFieldsNoId: Partial<ServiceFieldsNoId>): Promise<Service>;

  deleteService(ServiceId: number): Promise<number | string>;
}
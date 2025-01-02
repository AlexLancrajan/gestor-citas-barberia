import { ServiceFields } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";


export class FindService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async runGetService(serviceId: number): Promise<ServiceFields> {
    const service = await this.serviceRepository.getService(serviceId);
    if (!service) throw new Error('Service not found.');
    else return service;
  }

  async runGetServices(siteId: number | undefined, page: number, pageSize: number): Promise<ServiceFields[]> {
    const services = await this.serviceRepository.getServices(siteId, page, pageSize);
    if (!services) throw new Error('Services list is empty.');
    else return services;
  }

}
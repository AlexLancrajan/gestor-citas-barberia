import { Service } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";


export class FindService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async runGetService(serviceId: number): Promise<Service> {
    const service = await this.serviceRepository.getService(serviceId);
    if (!service) throw new Error('Service not found.');
    else return service;
  }

  async runGetServiceForUsers(serviceId: number): Promise<Service> {
    const service = await this.serviceRepository.getServiceForUsers(serviceId);
    if (!service) throw new Error('Service not found.');
    else return service;
  }

  async runGetServices(): Promise<Service[]> {
    const services = await this.serviceRepository.getServices();
    if (!services) throw new Error('Services list is empty.');
    else return services;
  }

  async runGetServicesForUsers(): Promise<Service[]> {
    const services = await this.serviceRepository.getServicesForUsers();
    if (!services) throw new Error('Services list is empty.');
    else return services;
  }
}
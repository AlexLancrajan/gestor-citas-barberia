import { ServiceRepository } from "../domain/service-repository";


export class DeleteService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async run(serviceId: number): Promise<number | string> {
    const deletedService = await this.serviceRepository.deleteService(serviceId);
    if (deletedService === 0) return 'Service already deleted';
    else return deletedService;
  }

}
import { Service, ServiceInputFields } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";


export class CreateService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async run(serviceInputFields: ServiceInputFields): Promise<Service> {
      const createdService = await this.serviceRepository.createService(serviceInputFields);
      if(!createdService) throw new Error('Could not create the service.');
      return createdService;
  }
}
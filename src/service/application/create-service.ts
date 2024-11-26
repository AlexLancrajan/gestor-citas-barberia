import { ServiceFields, ServiceInputFields } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";


export class CreateService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async run(serviceInputFields: ServiceInputFields): Promise<ServiceFields> {
    try {
      const createdService = await this.serviceRepository.createService(serviceInputFields); 
      return createdService;
    } catch (error) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
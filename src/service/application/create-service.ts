import { Service, ServiceFieldsNoId } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";


export class CreateService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async run(serviceFieldsNoId: ServiceFieldsNoId): Promise<Service> {
    try {
      const createdService = await this.serviceRepository.createService(serviceFieldsNoId);
      return createdService;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal Server Error');
      }
    }
  }
}
import { Service, ServiceFieldsNoId } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";


export class ModifyService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async run(serviceId: number, serviceFieldsNoId: Partial<ServiceFieldsNoId>): Promise<Service> {
    try {
      const modifiedServices = await this.serviceRepository.modifyService(serviceId, serviceFieldsNoId);
      return modifiedServices;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal Server Error');
      }
    }
  }
}
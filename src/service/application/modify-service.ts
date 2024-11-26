import { ServiceFields, ServiceInputFields } from "../domain/service";
import { ServiceRepository } from "../domain/service-repository";

export class ModifyService {
  constructor(private readonly serviceRepository: ServiceRepository) { }

  async run(serviceId: number, serviceInputFields: Partial<ServiceInputFields>): Promise<ServiceFields> {
    try {
      const modifiedServices = await this.serviceRepository.modifyService(serviceId, serviceInputFields);
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
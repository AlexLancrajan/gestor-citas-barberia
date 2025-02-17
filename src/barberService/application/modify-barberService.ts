import { barberService } from "../domain/barberService";
import { barberServiceRepository } from "../domain/barberService-repository";


export class ModifyBarberService {
  constructor(private readonly barberServiceRepository: barberServiceRepository) { }

  async run(
    barberId: string, 
    serviceId: number, 
    barberInputFields: Partial<barberService>): Promise<barberService> {
    try {
      const modifiedBarberService = await this.barberServiceRepository.modifyBarberService(
        barberId, serviceId, barberInputFields
      );
      return modifiedBarberService;
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
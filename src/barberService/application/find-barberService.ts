import { barberService } from "../domain/barberService";
import { barberServiceRepository } from "../domain/barberService-repository";


export class FindBarberService {
  constructor(private readonly barberServiceRepository: barberServiceRepository) { }

  async getBarberService(barberId: string | undefined, serviceId: number | undefined): Promise<barberService | null> {
    const barberService = await this.barberServiceRepository.getbarberService(barberId, serviceId);

    if(!barberService) return null;

    else return barberService;
  }

  async getAllBarberService(page: number, pageSize: number): Promise<barberService[] | null> {
    const manyBarberService = await this.barberServiceRepository.getAllbarberService(page, pageSize);

    if(!manyBarberService) return null;

    else return manyBarberService;
  }
}
import { barberServiceRepository } from "../domain/barberService-repository";


export class DeleteBarberService { 
  constructor(private readonly barberServiceRepository: barberServiceRepository) { }

  async run(barberId: string, serviceId: number): Promise<number | string> {
    const deletedStatus = await this.barberServiceRepository.deleteBarberService(barberId, serviceId);

    if(deletedStatus === 0) return 'barberService relation already deleted';

    return deletedStatus;
  }
}
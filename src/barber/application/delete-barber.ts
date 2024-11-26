import { BarberRepository } from "../domain/barber-repository";


export class DeleteBarber {
  constructor(private readonly barberRepository: BarberRepository) { }
  
  async run(barberId: string): Promise<number | string>{
    const deletedStatus = await this.barberRepository.deleteBarber(barberId);
    
    if(!deletedStatus) return 'Barber already deleted';

    return deletedStatus;
  }
}
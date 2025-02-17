import { barberService } from "../domain/barberService";
import { barberServiceRepository } from "../domain/barberService-repository";


export class CreateBarberService {
  constructor(private readonly barberServiceRepository: barberServiceRepository) { }

  async run(barberServiceFields: barberService): Promise<barberService> {
    try{
      const barberService = await this.barberServiceRepository.createBarberService(barberServiceFields); 
      return barberService;
    } catch(err: unknown) {
      if(err instanceof Error) {
        throw err;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
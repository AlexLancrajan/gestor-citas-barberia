import { BarberFields, BarberInputFields } from "../domain/barber";
import { BarberRepository } from "../domain/barber-repository";


export class ModifyBarber {
  constructor(private readonly barberRepository: BarberRepository) { }

  async run(barberId: string, barberInputFields: Partial<BarberInputFields>):
  Promise<BarberFields[]> 
  {
    try {
      const modifiedBarber = 
      await this.barberRepository.modifyBarber(barberId, barberInputFields);
      return modifiedBarber;
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
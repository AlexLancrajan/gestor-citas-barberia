import { BarberFields, BarberInputFields } from "../domain/barber";
import { BarberRepository } from "../domain/barber-repository";


export class CreateBarber {
  constructor(private readonly barberRepository: BarberRepository) { }

  async run(barberInputFields: BarberInputFields): Promise<BarberFields> {
    try {
      const barber = await this.barberRepository.createBarber(barberInputFields);
      return barber;
    } catch (error: unknown) {
      if(error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
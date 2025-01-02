import { BarberFields } from "../domain/barber";
import { BarberRepository } from "../domain/barber-repository";


export class FindBarber {
  constructor(private readonly barberRepository: BarberRepository) { }

  async runFindBarber(barberId: string, getSite: boolean): Promise<BarberFields> {
    const barber = await this.barberRepository.getBarber(barberId, getSite);

    if(!barber) throw new Error('Barber not found');

    return barber;
  }

  async runFindBarbers(
    siteId: number, 
    page: number, 
    pageSize: number, 
    getSites: boolean):
  Promise<BarberFields[]> 
  {
    const barbers = 
    await this.barberRepository.getBarbers(siteId, page, pageSize, getSites);

    if(!barbers) throw new Error('Could not find barbers');

    return barbers;
  }
}
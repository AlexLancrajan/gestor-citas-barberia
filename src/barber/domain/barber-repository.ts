import { BarberFields, BarberInputFields } from "./barber";

export interface BarberRepository {
  getBarber(barberId: string, getSite: boolean): Promise<BarberFields | null>;

  getBarbers(siteIdRef: number, page: number, pageSize: number, getSites: boolean):
  Promise<BarberFields[] | null>;

  createBarber(barberInputFields: BarberInputFields): 
  Promise<BarberFields>;

  modifyBarber(barberId: string, barberInputFields: Partial<BarberInputFields>):
  Promise<BarberFields[]>;

  deleteBarber(barberId: string): Promise<number>;
}
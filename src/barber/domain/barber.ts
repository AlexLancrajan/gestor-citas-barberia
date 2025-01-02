import { SiteFields } from "../../site/domain/site";

export interface BarberInputFields {
  barberName: string,
  barberSurname: string,
  barberPicture: string,
  barberDescription: string,
  siteId: number,
}

export interface BarberFields extends Partial<BarberInputFields> {
  barberId: string,
  siteRef?: SiteFields,
}
export interface BarberInputFields {
  barberName: string,
  barberSurname: string,
  barberPicture: string,
  barberDescription: string,
  siteIdRef: number,
}

export interface BarberFields extends Partial<BarberInputFields> {
  barberId: string,
}
export enum Availability {
  available,
  highlyOccupied,
  full
}

export interface BookingFields {
  bookingId: number,
  bookingDate: Date,
  disponibility: Availability,
  annotations?: string,
  userIdRef: number,
  serviceIdRef: number,
  siteIdRef: number,
}

export type BookingFieldsNoId = Omit<BookingFields, 'bookingId'>;

export class Booking {
  constructor(readonly bookingFields: BookingFields) { }
}
import { Availability } from "../../booking/domain/booking";

export interface AppointmentFields {
  appointmentId: number,
  appointmentDate: Date,
  appointmentDisponibility: Availability
}

export type AppointmentFieldsNoId = Omit<AppointmentFields, 'appointmentId'>;

export class Appointment {
  constructor(readonly appointmentFields: AppointmentFields) { }
}
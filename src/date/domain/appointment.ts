import { Availability } from "../../booking/domain/booking";
import { SiteFields } from "../../site/domain/site";

export interface AppointmentInputFields {
  appointmentDate: Date,
  appointmentAvailability: Availability
  siteId: number,
}

export interface AppointmentFields {
  appointmentId: number,
  appointmentDate: Date,
  appointmentAvailiability: Availability
}

export interface AppointmentDBFields {
  appointmentId: number,
  appointmentDate: Date,
  appointmentAvailiability: Availability,
  siteRef: SiteFields  
}

export class Appointment {
  constructor(readonly appointmentFields: AppointmentDBFields) { }
}
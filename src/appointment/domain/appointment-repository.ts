import { Appointment, AppointmentFieldsNoId } from "./appointment";


export interface AppointmentRepository {

  getAppointmentById(appointmentId: number): Promise<Appointment | null>;

  getAppointmentByDate(date: Date): Promise<Appointment | null>;

  getAppointments(): Promise<Appointment[] | null>;

  createAppointments(initDate: Date, endDate: Date): Promise<Appointment[]>;

  modifyAppointment(appointmentId: number, appointmentFieldsNoId: AppointmentFieldsNoId): Promise<Appointment>;

  deleteAppointment(appointmentId: number): Promise<number>;
}
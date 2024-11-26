import { Appointment, AppointmentInputFields } from "./appointment";


export interface AppointmentRepository {

  getAppointmentById(appointmentId: number): Promise<Appointment | null>;

  getAppointmentByDate(date: Date): Promise<Appointment | null>;

  getAppointments(): Promise<Appointment[] | null>;

  createAppointments(initDate: Date, endDate: Date, minutes: number): Promise<Appointment[] | null>;

  modifyAppointment(appointmentId: number, appointmentInputFields: AppointmentInputFields): Promise<Appointment>;

  deleteAppointment(appointmentId: number): Promise<number>;
}
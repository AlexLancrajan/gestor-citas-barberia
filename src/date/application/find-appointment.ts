import { Appointment } from "../domain/appointment";
import { AppointmentRepository } from "../domain/appointment-repository";


export class FindAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async runAppointment(appointmentId: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
    if (!appointment) throw new Error('Appointment not found.');
    else return appointment;
  }

  async runAppointments(): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.getAppointments();
    if (!appointments) throw new Error('Appointment list is empty.');
    else return appointments;
  }
}
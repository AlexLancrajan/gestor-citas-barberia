import { isDate } from "util/types";
import { AppointmentRepository } from "../domain/appointment-repository";
import { Appointment } from "../domain/appointment";


export class CheckAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async run(date: Date): Promise<Appointment> {
    if(!isDate(date)) throw new Error('Invalid format of date.');

    const appointment = await this.appointmentRepository.getAppointmentByDate(date);
    if (!appointment) throw new Error('Appointment not found');
    else return appointment;
  }
}
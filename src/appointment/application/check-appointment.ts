import { isDate } from "util/types";
import { Availability } from "../../booking/domain/booking";
import { AppointmentRepository } from "../domain/appointment-repository";


export class CheckAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async run(date: Date): Promise<[number, Availability]> {

    if(!isDate(date)) throw new Error('Invalid format of date.');

    const appointment = await this.appointmentRepository.getAppointmentByDate(date);

    if (!appointment) throw new Error('Appointment not found');

    else return [appointment.appointmentFields.appointmentId, appointment.appointmentFields.appointmentDisponibility];
  }
}
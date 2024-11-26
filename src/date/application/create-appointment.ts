import { Appointment } from "../domain/appointment";
import { AppointmentRepository } from "../domain/appointment-repository";


export class CreateAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async run(initDate: Date, endDate: Date, minutes: number): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.createAppointments(initDate, endDate, minutes);
    if(!appointments) throw new Error('Could not create appointments');
    else return appointments;
  }
}
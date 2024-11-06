import { Appointment } from "../domain/appointment";
import { AppointmentRepository } from "../domain/appointment-repository";


export class CreateAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async run(initDate: Date, endDate: Date): Promise<Appointment[]> {
    try {
      const appointments = await this.appointmentRepository.createAppointments(initDate, endDate);
      return appointments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error.');
      }
    }
  }
}
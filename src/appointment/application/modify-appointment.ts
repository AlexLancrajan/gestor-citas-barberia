import { Appointment, AppointmentFieldsNoId } from "../domain/appointment";
import { AppointmentRepository } from "../domain/appointment-repository";


export class ModifyAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async run(appointmentId: number, appointmentFieldsNoId: AppointmentFieldsNoId): Promise<Appointment> {
    try {
      const modifiedAppointment = await this.appointmentRepository.modifyAppointment(appointmentId, appointmentFieldsNoId);
      return modifiedAppointment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}
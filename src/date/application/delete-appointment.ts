import { AppointmentRepository } from "../domain/appointment-repository";


export class DeleteAppointment {
  constructor(private readonly appointmentRepository: AppointmentRepository) { }

  async run(appointmentId: number): Promise<number | string> {
    const deletedStatus = await this.appointmentRepository.deleteAppointment(appointmentId);
    if (deletedStatus === 0) return 'Appointment already deleted';
    else return deletedStatus;
  }
}
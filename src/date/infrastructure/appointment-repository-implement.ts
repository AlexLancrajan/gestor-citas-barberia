// Create appointment calendar (1 moth for example)
// Create trigger for deleting past day and and the following day 1 month ahead.

import { Appointment, AppointmentInputFields } from "../domain/appointment";
import { AppointmentRepository } from "../domain/appointment-repository";
import { Availability } from "../../booking/domain/booking";
import { generateDates } from "../../ztools/utils";
import { mySQLDate, mySQLSite } from "../../mySQL";

export class mySQLDateRepository implements AppointmentRepository {
  async getAppointmentById(appointmentId: number): Promise<Appointment | null> {
    const appointment = await mySQLDate.findByPk(appointmentId, { include:[mySQLSite] });
    return (appointment) ? new Appointment(appointment.toJSON()) : null;
  }

  async getAppointmentByDate(date: Date): Promise<Appointment | null> {
    const appointment = await mySQLDate.findOne({ where: { appointmentDate: date }, include:[mySQLSite]});
    return (appointment) ? new Appointment(appointment.toJSON()) : null;
  }

  async getAppointments(): Promise<Appointment[] | null> {
    const appointments = await mySQLDate.findAll({ include:[mySQLSite] });
    return (appointments) ? appointments.map(appointment => new Appointment(appointment.toJSON())) : null;
  }

  async createAppointments(initDate: Date, endDate: Date, minutes: number): Promise<Appointment[]> {
    const datesArray = generateDates(initDate, endDate, minutes);
    const dateObject = datesArray.map( date => (
      {
        appointmentDate: date,
        appointmentAvailability: Availability.available
      }
    ));

    const newAppointments = await mySQLDate.bulkCreate(dateObject);
    if(!newAppointments) throw new Error('Failed to create appointments');

    return newAppointments.map(appointment => new Appointment(appointment.toJSON()));
  }

  async modifyAppointment(appointmentId: number, appointmentInputFields: AppointmentInputFields): Promise<Appointment> {
    const findAppointment = await mySQLDate.findByPk(appointmentId);
    if (!findAppointment) throw new Error('Could find the appointment.');

    const modifiedAppointmentData: AppointmentInputFields = {...findAppointment.toJSON(), ...appointmentInputFields}; 
    await mySQLDate.update(modifiedAppointmentData, { where: { appointmentId: appointmentId } });

    const modifiedAppointment = await mySQLDate.findByPk(appointmentId);
    if(!modifiedAppointment) throw new Error('Could not modify the appointment.');

    return new Appointment(modifiedAppointment.toJSON());
  }

  async deleteAppointment(appointmentId: number): Promise<number> {
    const deletedAppointment = await mySQLDate.destroy({ where: { appointmentId: appointmentId } });
    return deletedAppointment;
  }

}
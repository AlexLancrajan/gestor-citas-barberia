// Create appointment calendar (1 moth for example)
// Create trigger for deleting past day and and the following day 1 month ahead.

import { DataTypes, Model, Sequelize } from "sequelize";
import { Appointment, AppointmentFieldsNoId } from "../domain/appointment";
import { AppointmentRepository } from "../domain/appointment-repository";
import { Availability } from "../../booking/domain/booking";
import { generateDates } from "../../utils";

class AppointmentImplementation extends Model { }

const initAppointmentModel = (sequelize: Sequelize) => {
  AppointmentImplementation.init(
    {
      appointmentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
      },
      appointmentDispoinibility: {
        type: DataTypes.ENUM(
          Availability.available.toString(),
          Availability.highlyOccupied.toString(),
          Availability.full.toString()
        ),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Appointment'
    }
  );
};

export class mySQLAppointmentRepository implements AppointmentRepository {
  constructor(readonly sequelize: Sequelize) {
    try {
      initAppointmentModel(sequelize);
      AppointmentImplementation.sync().catch(console.error);
    } catch (error: unknown) {
      console.log(error);
    }
  }
  async getAppointmentById(appointmentId: number): Promise<Appointment | null> {
    const appointment = await AppointmentImplementation.findByPk(appointmentId);

    if (appointment) return appointment.toJSON();

    else return null;
  }

  async getAppointmentByDate(date: Date): Promise<Appointment | null> {
    const appointment = await AppointmentImplementation.findOne({ where: { appointmentDate: date }});

    if (appointment) return appointment.toJSON();

    else return null;
  }

  async getAppointments(): Promise<Appointment[] | null> {
    const appointments = await AppointmentImplementation.findAll();

    if (appointments) return appointments.map(appointment => new Appointment(appointment.toJSON()));

    else return null;
  }
  async createAppointments(initDate: Date, endDate: Date): Promise<Appointment[]> {
    const datesArray = generateDates(initDate, endDate);
    
    const dateObject = datesArray.map( date => (
      {
        appointmentDate: date,
        appointmentAvailability: Availability.available
      }
    ));

    const newAppointments = await AppointmentImplementation.bulkCreate(dateObject);

    if(!newAppointments) throw new Error('Failed to create appointments');

    return newAppointments.map(appointment => new Appointment(appointment.toJSON()));

  }
  async modifyAppointment(appointmentId: number, appointmentFieldsNoId: AppointmentFieldsNoId): Promise<Appointment> {
    const findAppointment = await AppointmentImplementation.findByPk(appointmentId);

    if (findAppointment) {
      const originalAppointment: Appointment = new Appointment(findAppointment.toJSON());
      const modifiedAppointment = await AppointmentImplementation.update(
        {
          appointmentDate: appointmentFieldsNoId.appointmentDate || originalAppointment.appointmentFields.appointmentDate,
          appointmentDisponibility: appointmentFieldsNoId.appointmentDisponibility|| originalAppointment.appointmentFields.appointmentDisponibility,
        },
        { where: { appointmentId: appointmentId } }
      );

      if (modifiedAppointment) {
        const newAppointment = await AppointmentImplementation.findByPk(appointmentId);

        if (newAppointment) return newAppointment.toJSON();
        else throw new Error('Modified appointment not Found');
      } else {
        throw new Error('Could not modify the appointment');
      }
    } else {
      throw new Error('appointment not found');
    }
  }

  async deleteAppointment(appointmentId: number): Promise<number> {
    const deletedAppointment = await AppointmentImplementation.destroy({ where: { appointmentId: appointmentId } });
    return deletedAppointment;
  }

}
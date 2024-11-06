import { sequelize } from '../../app';
import { CheckAppointment } from '../application/check-appointment';
import { CreateAppointment } from '../application/create-appointment';
import { DeleteAppointment } from '../application/delete-appointment';
import { FindAppointment } from '../application/find-appointment';
import { ModifyAppointment } from '../application/modify-appointment';
import { AppointmentController } from './appointment-controller';
import { mySQLAppointmentRepository } from "./appointment-repository-implement";


const appointmentRepository = new mySQLAppointmentRepository(sequelize);

const findAppointment = new FindAppointment(appointmentRepository);

const createAppointment = new CreateAppointment(appointmentRepository);

export const checkAppointment = new CheckAppointment(appointmentRepository);

export const modifyAppointment = new ModifyAppointment(appointmentRepository);

const deleteAppointment = new DeleteAppointment(appointmentRepository);

export const appointmentController = new AppointmentController(
  findAppointment,
  createAppointment,
  checkAppointment,
  modifyAppointment,
  deleteAppointment
);
import options from './config';
import express from 'express';
import { Sequelize } from 'sequelize';
// Database instance
export const sequelize = new Sequelize(
  options.databaseName,
  options.databaseUser,
  options.databasePassword,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

export async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

import { tokenExtractor } from './middleware';
import { userRouter } from './user/infrastructure/user-router';
import { siteRouter } from './site/infrastructure/site-router';
import { serviceRouter } from './service/infrastructure/service-router';
import { bookingRouter } from './booking/infrastructure/booking-router';
import { appointmentRouter } from './appointment/infrastructure/appointment-router';

const app = express();

app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', userRouter);
app.use('/api/sites', siteRouter);
app.use('api/services', serviceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/appointments', appointmentRouter);

export { app };
import express from 'express';

//Create and initialize database.
import { initSQLModels } from './mySQL';
initSQLModels().catch(console.error);

//Routes for the application.
import { userRouter } from './user/infrastructure/user-router';
import { googleRouter } from './zsign-up-strategies/google-sign-up';
import { siteRouter } from './site/infrastructure/site-router';
import { barberRouter } from './barber/infrastructure/barber-router';
// import { serviceRouter } from './service/infrastructure/service-router';
// import { bookingRouter } from './booking/infrastructure/booking-router';
// import { appointmentRouter } from './date/infrastructure/appointment-router';
import cookieParser from 'cookie-parser';

const app = express();

//Middlewares.
app.use(express.json());
app.use(cookieParser());

//Routes.
app.use('/api/users', userRouter);
app.use('/api/google', googleRouter);
app.use('/api/sites', siteRouter);
app.use('/api/barbers', barberRouter);
// app.use('/api/services', serviceRouter);
// app.use('/api/bookings', bookingRouter);
// app.use('/api/appointments', appointmentRouter);


//Error Handler.

export { app };
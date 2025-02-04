import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Create and initialize database.
import { initSQLModels } from './mySQL';

void (async () => {
  await initSQLModels().catch(console.error);
}) ();

//Routes for the application.
import { userRouter } from './user/infrastructure/user-router';
// import { googleRouter } from './zsign-up-strategies/google-sign-up'; Due to the nature of the application I build this is not necessay.
import { siteRouter } from './site/infrastructure/site-router';
import { barberRouter } from './barber/infrastructure/barber-router';
import { serviceRouter } from './service/infrastructure/service-router';
import { dateRouter } from './date/infrastructure/date-router';
import { bookingRouter } from './booking/infrastructure/booking-router';
import cookieParser from 'cookie-parser';
import options from './ztools/config';

const app = express();

//Loggers.
const MODE = process.env.NODE_ENV ? 'dev' : 'tiny';
app.use(morgan(MODE));

//Middlewares.
if(process.env.NODE_ENV) {
  app.use(cors());
} else {
  app.use(cors(
  {
    origin: options.accessUrls
  }));
}

app.use(express.json());
app.use(cookieParser());

//Routes.
app.use('/api/users', userRouter);
// app.use('/api/google', googleRouter); Not needed therefore.
app.use('/api/sites', siteRouter);
app.use('/api/barbers', barberRouter);
app.use('/api/services', serviceRouter);
app.use('/api/dates', dateRouter);
app.use('/api/bookings', bookingRouter);

//Error Handler.

app.listen(options.port, () => {
  console.log(`Server is listening on PORT ${options.port}`);
});
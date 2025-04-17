import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import options from './ztools/config';

//Create and initialize database.
import { initSQLModels } from './mySQL';

void (async () => {
  await initSQLModels().catch(console.error);
}) ();

//Routes for the application.
import configRouter from './ztools/config-router';
import { userRouter } from './user/infrastructure/user-router';
import { siteRouter } from './site/infrastructure/site-router';
import { barberRouter } from './barber/infrastructure/barber-router';
import { serviceRouter } from './service/infrastructure/service-router';
import { dateRouter } from './date/infrastructure/date-router';
import { bookingRouter } from './booking/infrastructure/booking-router';
import { webhookController } from './ztools/stripe-service';
import barberServiceRouter from './barberService/infrastructure/barberService-router';
import serviceSiteRouter from './serviceSite/infrastructure/serviceSite-router';

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

//Webhooks
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/webhook', express.raw({ type: 'application/json' }), webhookController);

app.use(express.json());
app.use(cookieParser());

//Config time limit
app.use('/api/config', configRouter);

//Routes.
app.use('/api/users', userRouter);
app.use('/api/sites', siteRouter);
app.use('/api/barbers', barberRouter);
app.use('/api/services', serviceRouter);
app.use('/api/dates', dateRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/barberService', barberServiceRouter);
app.use('/api/serviceSite', serviceSiteRouter);

//Error Handler.

app.listen(options.port, () => {
  console.log(`Server is listening on PORT ${options.port}`);
});
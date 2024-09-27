import express from 'express';
import { tokenExtractor } from './middleware';
import { userRouter } from './user/infrastructure/user-router';
import options from './config';
import { Sequelize } from 'sequelize';
import { error } from 'console';

const app = express();

// Database instance
const sequelize = new Sequelize(options.databaseUrl);

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
checkConnection().catch(error);


app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', userRouter);

export { app, sequelize };
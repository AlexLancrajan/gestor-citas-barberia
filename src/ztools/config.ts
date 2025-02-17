import dotenv from "dotenv";
dotenv.config();

interface Options {
  port: number,
  accessUrls: string[],
  timeLimit: Date,
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  databaseName: string,
  databaseUser: string,
  databasePassword: string,
  databaseHost: string,
  databaseDialect: string,
  GOOGLE_CLIENT_ID: string,
  GOOGLE_CLIENT_SECRET: string,
  GOOGLE_CALLBACK_URL: string,
  STRIPE_SECRET_KEY: string,
  STRIPE_WEBHOOK_SECRET: string
};

const options: Options = {
  port: Number(process.env.PORT) || 3000,
  accessUrls: process.env.ACCESS_URLS ? process.env.ACCESS_URLS.split(',') : [],
  timeLimit: new Date(0,0,0,0,30,0,0), // Defaults to 30 min. Can implement hours.
  ACCESS_TOKEN_SECRET: process.env.ACCESS_SECRET ? process.env.ACCESS_SECRET : "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "",
  databaseName: process.env.DATABASE_NAME ? process.env.DATABASE_NAME : "",
  databaseUser: process.env.DATABASE_USERNAME ? process.env.DATABASE_USERNAME : "",
  databasePassword: process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD : "",
  databaseHost: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : "localhost",
  databaseDialect: process.env.DATABASE_DIALECT ? process.env.DATABASE_DIALECT : "mysql",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID: "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET: "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL ? process.env.GOOGLE_CALLBACK_URL : "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET: ""
};

export default options;

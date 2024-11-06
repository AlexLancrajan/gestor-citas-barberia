import dotenv from "dotenv";
dotenv.config();

interface Options {
  port: number,
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  databaseName: string,
  databaseUser: string,
  databasePassword: string,
  databaseHost: string
};

const options: Options = {
  port: Number(process.env.PORT) || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_SECRET ? process.env.ACCESS_SECRET : "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "",
  databaseName: process.env.DATABASE_NAME ? process.env.DATABASE_NAME : "",
  databaseUser: process.env.DATABASE_USERNAME ? process.env.DATABASE_USERNAME : "",
  databasePassword: process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD : "",
  databaseHost: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : ""
};

export default options;

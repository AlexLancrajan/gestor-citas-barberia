import dotenv from "dotenv";
dotenv.config();

interface Options {
  port: number,
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  databaseUrl: string
};

const options: Options = {
  port: Number(process.env.PORT) || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_SECRET ? process.env.ACCESS_SECRET : "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "",
  databaseUrl: process.env.DATABASEURL ? process.env.DATABASEURL : ""
};

export default options;

import dotenv from "dotenv";
dotenv.config();

interface Options {
  port: number,
  ACCESS_TOKEN_SECRET: string | undefined
  REFRESH_TOKEN_SECRET: string | undefined
};

const options: Options = {
  port: Number(process.env.PORT) || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_SECRET
};

export default options;

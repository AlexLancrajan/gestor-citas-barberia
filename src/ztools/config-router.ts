import express, { Request, Response } from "express";
import { validateSchemaData, verifyTokenMiddleware } from "./middleware";
import { z } from "zod";

import { Roles } from "../user/domain/user";
import options from "./config";
import { setTimeLimits } from "./utils";

const configRouter = express.Router();

const configSchema = z.object({
  hours: z.number({ message: "Hours format error." })
    .gte(0, { message: "Must be positive" })
    .lte(24, { message: "A day has 24 hours at maximum."}),
  minutes: z.number({ message: "Minutes format error." })
    .gte(0, { message: "Must be positive" })
    .lte(59, { message: "Can't exceed 59 minutes, add more hours"})
}).strict();

type ConfigSchema = z.infer<typeof configSchema>;

configRouter.get('/', verifyTokenMiddleware, (req: Request, res: Response) => {
  if (req.userToken?.role.toString().toLowerCase() !== Roles.admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  return res.json({
    timeLimit: options.timeLimit,
  });
  
});

configRouter.post('/', verifyTokenMiddleware, validateSchemaData(configSchema),(req: Request, res: Response) => {
  if (req.userToken?.role.toString().toLowerCase() !== Roles.admin) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const { hours, minutes } = req.body as ConfigSchema;
  setTimeLimits(hours, minutes);

  return res.json({
    timeLimit: options.timeLimit
  });
  
});

export default configRouter;


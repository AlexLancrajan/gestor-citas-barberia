/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z, ZodError, ZodObject } from 'zod';
import options from './config';
import { UserForToken } from '../user/domain/user';

declare module 'express' {
  interface Request {
    userToken?: UserForToken
  }
}

export const validateSchemaData = (schema: z.ZodObject<any, any> | z.ZodArray<ZodObject<any,any>>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.message}`
        }));
        res.status(400).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  };
};

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers['authorization']?.split(' ')[1] as string;
  const refreshToken = req.cookies['refresh'] as string;

  if(!accessToken && !refreshToken) {
    return res.status(401).json({ error: 'Access denied. No tokens provided'});
  } else {
    try {
      const decodedToken: UserForToken = jwt.verify(accessToken, options.ACCESS_TOKEN_SECRET) as UserForToken;
      req.userToken = decodedToken;
      next();
    } catch (_error: unknown) {
      if(!refreshToken) {
        return res.status(401).json({ error: 'Access denied. No refresh token provided'});
      }
      return res.redirect('/api/users/refresh');
    }
  }
};



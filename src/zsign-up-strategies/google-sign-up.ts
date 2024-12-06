import passport from "passport";
import { GoogleStrategy } from "../ztools/middleware";

import { Request, RequestHandler, Response, Router } from "express";

const googleRouter = Router();

passport.use(GoogleStrategy);
googleRouter.use(passport.initialize());

googleRouter.get('/',
  passport.authenticate('google', 
    { 
    scope: ['email', 'profile'] 
    }
  ) as RequestHandler
);

googleRouter.get('/callback',
  passport.authenticate('google',
    {
      failureRedirect: '/login',
      session: false,
    }
  ) as RequestHandler,
  (req: Request, res: Response) => {
    if(req.user){
      return res.json(req.user);
    }
    return res.status(400).json({ error: 'No user found' });
  }
);

export { googleRouter };

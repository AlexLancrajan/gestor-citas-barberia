import passport from "passport";
import { Request, RequestHandler, Response, Router } from "express";
import { Strategy, Profile } from 'passport-google-oauth20';
import options from "../ztools/config";

const GoogleStrategy = new Strategy(
  {
    clientID: options.GOOGLE_CLIENT_ID,
    clientSecret: options.GOOGLE_CLIENT_SECRET,
    callbackURL: options.GOOGLE_CALLBACK_URL,
  },

  (_accessToken, _refreshToken, profile: Profile, done) => {
    try {
      const user = {
        googleId: profile.id,
        email: profile.emails?.[0].value,
        name: profile.displayName
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

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

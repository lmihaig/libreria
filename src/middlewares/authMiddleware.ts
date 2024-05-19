import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    passport.authenticate('bearer', { session: false }, (err: any, user: any) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
      next();
    })(req, res, next);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

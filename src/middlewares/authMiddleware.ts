import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('You must be logged in to access this resource');
}



export const ensureUserOwnership = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const paramUserId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (userId !== paramUserId) {
    return res.status(403).json({ error: 'You do not have permission to modify this data' });
  }

  next();
};


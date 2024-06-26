import { Request, Response, NextFunction } from 'express';

export const validateBookInstance = (req: Request, res: Response, next: NextFunction) => {
  const { isbn } = req.body;
  if (!isbn) {
    return res.status(400).json({ error: 'ISBN is required' });
  }
  if (typeof isbn !== 'string' || isbn.length !== 13) {
    return res.status(400).json({ error: 'Invalid ISBN format' });
  }
  next();
};

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { nickname } = req.body;
  if (!nickname) {
    return res.status(400).json({ error: 'New nickname is required' });
  }
  if (typeof nickname !== 'string' || nickname.length > 32) {
    return res.status(400).json({ error: 'Invalid nickname format' });
  }
  next();
};

export const validateFriendship = (req: Request, res: Response, next: NextFunction) => {
  const { user2Id } = req.body;
  if (!user2Id) {
    return res.status(400).json({ error: 'User2 ID is required' });
  }
  if (typeof user2Id !== 'number') {
    return res.status(400).json({ error: 'Invalid User2 ID format' });
  }
  next();
};



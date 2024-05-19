import { Router, Request, Response, response } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline' }));

router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/failure',
  successRedirect: '/auth/success'
}));

router.get('/auth/success', (req: Request, res: Response) => {
  res.send('Authentication successful');
});

router.get('/auth/failure', (req: Request, res: Response) => {
  res.send('Authentication failed');
});

router.get('/test', ensureAuthenticated, (req: Request, res: Response) => {
  res.send('Youre in !');
})

router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.send('Logged out');
    });
  });
});

export default router;


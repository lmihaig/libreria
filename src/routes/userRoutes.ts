import { Router, Request, Response } from 'express';
import db from '../db/drizzle';
import { users } from '../db/schema';
import { ensureAuthenticated, ensureUserOwnership } from '../middlewares/authMiddleware';
import { eq } from 'drizzle-orm';
import { validateUser } from '../middlewares/validationMiddleware';

const router = Router();

router.get('/:id', ensureAuthenticated, ensureUserOwnership, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId)
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/:id', ensureAuthenticated, ensureUserOwnership, validateUser, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { nickname } = req.body;

  try {
    const updatedUser = await db.update(users)
      .set({ nickname })
      .where(eq(users.id, userId))
      .returning();

    res.status(200).json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', ensureAuthenticated, ensureUserOwnership, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    await db.delete(users).where(eq(users.id, userId));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;


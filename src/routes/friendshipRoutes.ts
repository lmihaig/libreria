import { Router, Request, Response } from 'express';
import db from '../db/drizzle';
import { friendships, users } from '../db/schema';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { eq, and } from 'drizzle-orm';
import { validateFriendship } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/', ensureAuthenticated, validateFriendship, async (req: Request, res: Response) => {
  const { user2Id } = req.body;
  const user1Id = Number(req.user?.id);

  try {
    const newFriendship = await db.insert(friendships).values({
      user1Id,
      user2Id,
      status: 'pending'
    }).returning();

    res.status(201).json(newFriendship[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add friendship' });
  }
});

router.put('/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const friendshipId = parseInt(req.params.id, 10);
  const { status } = req.body;

  try {
    const updatedFriendship = await db.update(friendships)
      .set({ status })
      .where(eq(friendships.id, friendshipId))
      .returning();

    res.status(200).json(updatedFriendship[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update friendship' });
  }
});

router.delete('/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const friendshipId = parseInt(req.params.id, 10);

  try {
    await db.delete(friendships).where(eq(friendships.id, friendshipId));
    res.status(200).json({ message: 'Friendship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete friendship' });
  }
});

router.get('/', ensureAuthenticated, async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  try {
    const userFriendships = await db.query.friendships.findMany({
      where: (friendships, { eq }) => eq(friendships.user1Id, userId) || eq(friendships.user2Id, userId)
    });

    res.status(200).json(userFriendships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friendships' });
  }
});

export default router;


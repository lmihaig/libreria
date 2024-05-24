import { Router, Request, Response } from 'express';
import db from '../db/drizzle';
import { readingLists } from '../db/schema';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { eq } from 'drizzle-orm';
import { validateBookInstance } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/', ensureAuthenticated, validateBookInstance, async (req: Request, res: Response) => {
  const { isbn } = req.body;
  const userId = Number(req.user?.id);

  try {
    const newReadingList = await db.insert(readingLists).values({
      userId,
      isbn
    }).returning();

    res.status(201).json(newReadingList[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to reading list' });
  }
});

router.delete('/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const readingListId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  try {
    await db.delete(readingLists).where(eq(readingLists.id, readingListId));
    res.status(200).json({ message: 'Removed from reading list successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from reading list' });
  }
});

router.get('/', ensureAuthenticated, async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);

  try {
    const userReadingList = await db.query.readingLists.findMany({
      where: (readingLists, { eq }) => eq(readingLists.userId, userId)
    });

    res.status(200).json(userReadingList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading list' });
  }
});

export default router;

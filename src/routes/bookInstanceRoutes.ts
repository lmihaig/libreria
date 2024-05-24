import { Router, Request, Response } from 'express';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import db from '../db/drizzle';
import { bookInstances } from '../db/schema';
import { eq } from 'drizzle-orm';
import { validateBookInstance } from '../middlewares/validationMiddleware';
const router = Router();

router.post('/', ensureAuthenticated, validateBookInstance, async (req: Request, res: Response) => {
  const { isbn } = req.body;
  const userId = req.user?.id;


  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const newBookInstance = await db.insert(bookInstances).values({
      ownerId: userId,
      isbn: isbn
    }).returning();

    res.status(201).json(newBookInstance[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book instance' });
  }
});

router.delete('/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const bookInstanceId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const bookInstance = await db.query.bookInstances.findFirst({
      where: (bookInstances, { eq }) => eq(bookInstances.id, bookInstanceId) && eq(bookInstances.ownerId, userId)
    });

    if (!bookInstance) {
      return res.status(404).json({ error: 'Book instance not found or does not belong to you' });
    }

    await db.delete(bookInstances).where(eq(bookInstances.id, bookInstanceId));
    res.status(200).json({ message: 'Book instance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book instance' });
  }
});

router.put('/:id', ensureAuthenticated, validateBookInstance, async (req: Request, res: Response) => {
  const bookInstanceId = parseInt(req.params.id, 10);
  const { isbn } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const bookInstance = await db.query.bookInstances.findFirst({
      where: (bookInstances, { eq }) => eq(bookInstances.id, bookInstanceId) && eq(bookInstances.ownerId, userId)
    });

    if (!bookInstance) {
      return res.status(404).json({ error: 'Book instance not found or does not belong to you' });
    }

    const updatedBookInstance = await db.update(bookInstances)
      .set({ isbn: isbn })
      .where(eq(bookInstances.id, bookInstanceId))
      .returning();

    res.status(200).json(updatedBookInstance[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book instance' });
  }
});

router.get('/', ensureAuthenticated, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const userBookInstances = await db.query.bookInstances.findMany({
      where: (bookInstances, { eq }) => eq(bookInstances.ownerId, userId)
    });

    res.status(200).json(userBookInstances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book instances' });
  }
});

export default router;


import { Router, Request, Response } from 'express';
import db from '../db/drizzle';
import { bookTransactions, bookInstances, friendships } from '../db/schema';
import { ensureAuthenticated } from '../middlewares/authMiddleware';
import { eq, and, or, desc } from 'drizzle-orm';

const router = Router();

router.post('/request', ensureAuthenticated, async (req: Request, res: Response) => {
  const { bookInstanceId } = req.body;
  const borrowerId = req.user?.id;

  if (!borrowerId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const bookInstance = await db.query.bookInstances.findFirst({
      where: (bookInstances, { eq }) => eq(bookInstances.id, bookInstanceId)
    });

    if (!bookInstance) {
      return res.status(404).json({ error: 'Book instance not found' });
    }

    const friendship = await db.query.friendships.findFirst({
      where: (friendships, { or, and }) => or(
        and(eq(friendships.user1Id, borrowerId), eq(friendships.user2Id, bookInstance.ownerId), eq(friendships.status, 'accepted')),
        and(eq(friendships.user1Id, bookInstance.ownerId), eq(friendships.user2Id, borrowerId), eq(friendships.status, 'accepted'))
      )
    });

    if (!friendship) {
      return res.status(403).json({ error: 'You must be friends with the book owner to borrow this book' });
    }

    const latestTransaction = await db.query.bookTransactions.findFirst({
      where: (bookTransactions, { eq }) => eq(bookTransactions.bookInstanceId, bookInstanceId),
      orderBy: [desc(bookTransactions.transactionDate)]
    });

    if (latestTransaction && latestTransaction.transactionType === 'borrow' && latestTransaction.status === 'accepted') {
      return res.status(400).json({ error: 'This book is currently borrowed by another user' });
    }

    const newTransaction = await db.insert(bookTransactions).values({
      bookInstanceId,
      ownerId: bookInstance.ownerId,
      borrowerId,
      transactionType: 'borrow',
      status: 'pending'
    }).returning();

    res.status(201).json(newTransaction[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create borrow request' });
  }
});

router.put('/:id/accept', ensureAuthenticated, async (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id, 10);
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const transaction = await db.query.bookTransactions.findFirst({
      where: (bookTransactions, { and, eq }) => and(
        eq(bookTransactions.id, transactionId),
        eq(bookTransactions.ownerId, ownerId),
        eq(bookTransactions.status, 'pending')
      )
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized to accept' });
    }

    const updatedTransaction = await db.update(bookTransactions)
      .set({ status: 'accepted' })
      .where(eq(bookTransactions.id, transactionId))
      .returning();

    res.status(200).json(updatedTransaction[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept borrow request' });
  }
});

router.put('/:id/decline', ensureAuthenticated, async (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id, 10);
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const transaction = await db.query.bookTransactions.findFirst({
      where: (bookTransactions, { and, eq }) => and(
        eq(bookTransactions.id, transactionId),
        eq(bookTransactions.ownerId, ownerId),
        eq(bookTransactions.status, 'pending')
      )
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized to decline' });
    }

    const updatedTransaction = await db.update(bookTransactions)
      .set({ status: 'declined' })
      .where(eq(bookTransactions.id, transactionId))
      .returning();

    res.status(200).json(updatedTransaction[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decline borrow request' });
  }
});

router.put('/:id/return', ensureAuthenticated, async (req: Request, res: Response) => {
  const transactionId = parseInt(req.params.id, 10);
  const borrowerId = req.user?.id;

  if (!borrowerId) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  try {
    const transaction = await db.query.bookTransactions.findFirst({
      where: (bookTransactions, { and, eq }) => and(
        eq(bookTransactions.id, transactionId),
        eq(bookTransactions.borrowerId, borrowerId),
        eq(bookTransactions.status, 'accepted'),
        eq(bookTransactions.transactionType, 'borrow')
      )
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized to return' });
    }

    const returnTransaction = await db.insert(bookTransactions).values({
      bookInstanceId: transaction.bookInstanceId,
      ownerId: transaction.ownerId,
      borrowerId,
      transactionType: 'return',
      status: 'accepted'
    }).returning();

    res.status(200).json(returnTransaction[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
});

export default router;


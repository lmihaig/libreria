import { integer, text, pgTable, serial, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  googleId: varchar('google_id', { length: 50 }).notNull(),
  nickname: varchar('nickname', { length: 32 }).notNull(),
});

export const statusEnum = pgEnum('status', ['pending', 'accepted', 'declined'])

export const friendships = pgTable('friendships', {
  id: serial('id').primaryKey(),
  user1Id: integer('user1Id').references(() => users.id).notNull(),
  user2Id: integer('user2Id').references(() => users.id).notNull(),
  status: statusEnum('status').default('pending').notNull(),
});

export const bookInstances = pgTable('book_instances', {
  id: serial('id').primaryKey(),
  ownerId: integer('ownerId').references(() => users.id).notNull(),
  isbn: varchar('isbn', { length: 13 }).notNull(),
});

export const readingLists = pgTable('reading_lists', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id).notNull(),
  isbn: varchar('isbn', { length: 13 }).notNull(),
});

export const bookTransactionTypeEnum = pgEnum('book_transaction_type', ['borrow', 'return']);

export const bookTransactions = pgTable('book_transactions', {
  id: serial('id').primaryKey(),
  bookInstanceId: integer('book_instance_id').references(() => bookInstances.id).notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  borrowerId: integer('borrower_id').references(() => users.id).notNull(),
  transactionType: bookTransactionTypeEnum('transaction_type').notNull(),
  transactionDate: timestamp('transaction_date').defaultNow().notNull(),
  status: statusEnum('status').default('pending').notNull(),
});

import { text, integer, pgTable, serial, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';


export const status = pgEnum('status', ['pending', 'accepted', 'declined'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nickname: varchar('nickname', { length: 32 }),
});

export const friendships = pgTable('friendships', {
  id: 
})

export const books = pgTable('books', {
  isbn: varchar('isbn', { length: 13 }).primaryKey(),
  title: text('title'),
  author: text('author')
});

export const bookInstances = pgTable('book_instances', {
  owner:
    holder:
})

export const readingLists = pgTable('reading_lists', {
  id: serial('id').primaryKey(),
  userId: integer('userId').references(() => users.id),
  bookId: varchar('bookId').references(() => books.isbn),
});

export const transactionType = pgEnum('transactionType', ['borrow', 'return'])

export const bookTransactions = pgTable('book_transactions', {
  id: serial('id').primaryKey(),
  bookId: varchar('bookId').references(() => books.isbn),
  ownerId: integer('ownerId').references(() => users.id),
  borrowerId: integer('borrowerId').references(() => users.id),
  transactionType: transactionType('transactionType'),
  transactionDate: timestamp('transactionDate'),
});


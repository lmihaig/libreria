"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookTransactions = exports.transactionType = exports.readingLists = exports.bookInstances = exports.books = exports.friendships = exports.users = exports.status = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.status = (0, pg_core_1.pgEnum)('status', ['pending', 'accepted', 'declined']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    nickname: (0, pg_core_1.varchar)('nickname', { length: 32 }),
});
exports.friendships = (0, pg_core_1.pgTable)('friendships', {
    id: 
});
exports.books = (0, pg_core_1.pgTable)('books', {
    isbn: (0, pg_core_1.varchar)('isbn', { length: 13 }).primaryKey(),
    title: (0, pg_core_1.text)('title'),
    author: (0, pg_core_1.text)('author')
});
exports.bookInstances = (0, pg_core_1.pgTable)('book_instances', {
    owner: holder
});
exports.readingLists = (0, pg_core_1.pgTable)('reading_lists', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('userId').references(() => exports.users.id),
    bookId: (0, pg_core_1.varchar)('bookId').references(() => exports.books.isbn),
});
exports.transactionType = (0, pg_core_1.pgEnum)('transactionType', ['borrow', 'return']);
exports.bookTransactions = (0, pg_core_1.pgTable)('book_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    bookId: (0, pg_core_1.varchar)('bookId').references(() => exports.books.isbn),
    ownerId: (0, pg_core_1.integer)('ownerId').references(() => exports.users.id),
    borrowerId: (0, pg_core_1.integer)('borrowerId').references(() => exports.users.id),
    transactionType: (0, exports.transactionType)('transactionType'),
    transactionDate: (0, pg_core_1.timestamp)('transactionDate'),
});

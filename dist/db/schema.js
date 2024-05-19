"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookTransactions = exports.bookTransactionTypeEnum = exports.readingLists = exports.bookInstances = exports.friendships = exports.statusEnum = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    googleId: (0, pg_core_1.varchar)('google_id', { length: 50 }).notNull(),
    nickname: (0, pg_core_1.varchar)('nickname', { length: 32 }).notNull(),
});
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['pending', 'accepted', 'declined']);
exports.friendships = (0, pg_core_1.pgTable)('friendships', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    user1Id: (0, pg_core_1.integer)('user1Id').references(() => exports.users.id).notNull(),
    user2Id: (0, pg_core_1.integer)('user2Id').references(() => exports.users.id).notNull(),
    status: (0, exports.statusEnum)('status').default('pending').notNull(),
});
exports.bookInstances = (0, pg_core_1.pgTable)('book_instances', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    ownerId: (0, pg_core_1.integer)('ownerId').references(() => exports.users.id).notNull(),
    isbn: (0, pg_core_1.varchar)('isbn', { length: 13 }).notNull(),
});
exports.readingLists = (0, pg_core_1.pgTable)('reading_lists', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('userId').references(() => exports.users.id).notNull(),
    isbn: (0, pg_core_1.varchar)('isbn', { length: 13 }).notNull(),
});
exports.bookTransactionTypeEnum = (0, pg_core_1.pgEnum)('book_transaction_type', ['borrow', 'return']);
exports.bookTransactions = (0, pg_core_1.pgTable)('book_transactions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    bookInstanceId: (0, pg_core_1.integer)('book_instance_id').references(() => exports.bookInstances.id).notNull(),
    ownerId: (0, pg_core_1.integer)('owner_id').references(() => exports.users.id).notNull(),
    borrowerId: (0, pg_core_1.integer)('borrower_id').references(() => exports.users.id).notNull(),
    transactionType: (0, exports.bookTransactionTypeEnum)('transaction_type').notNull(),
    transactionDate: (0, pg_core_1.timestamp)('transaction_date').defaultNow().notNull(),
    status: (0, exports.statusEnum)('status').default('pending').notNull(),
});

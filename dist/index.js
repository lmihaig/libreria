"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const drizzle_1 = __importDefault(require("./db/drizzle"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const schema_1 = require("./db/schema");
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookInstanceRoutes_1 = __importDefault(require("./routes/bookInstanceRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const friendshipRoutes_1 = __importDefault(require("./routes/friendshipRoutes"));
const readingListRoutes_1 = __importDefault(require("./routes/readingListRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const bookTransactionRoutes_1 = __importDefault(require("./routes/bookTransactionRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: (_b = process.env.SESSION_SECRET) !== null && _b !== void 0 ? _b : '', resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield drizzle_1.default.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id)
        });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    tokenURL: 'https://oauth2.googleapis.com/token',
    clientID: (_c = process.env.GOOGLE_CLIENT_ID) !== null && _c !== void 0 ? _c : '',
    clientSecret: (_d = process.env.GOOGLE_CLIENT_SECRET) !== null && _d !== void 0 ? _d : '',
    callbackURL: '/auth/google/callback',
    state: true,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingUser = yield drizzle_1.default.query.users.findFirst({
                where: (users, { eq }) => eq(users.googleId, profile.id)
            });
            if (existingUser) {
                return done(null, existingUser);
            }
            const newUser = yield drizzle_1.default.insert(schema_1.users).values({
                googleId: profile.id,
                nickname: profile.displayName
            }).returning();
            return done(null, newUser[0]);
        }
        catch (error) {
            return done(error, null);
        }
    });
}));
// Public routes
app.use('/', authRoutes_1.default);
// Private routes -
app.use('/book-instances', authMiddleware_1.ensureAuthenticated, bookInstanceRoutes_1.default);
app.use('/users', authMiddleware_1.ensureAuthenticated, userRoutes_1.default);
app.use('/friendships', authMiddleware_1.ensureAuthenticated, friendshipRoutes_1.default);
app.use('/reading-lists', authMiddleware_1.ensureAuthenticated, readingListRoutes_1.default);
app.use('/book-transactions', authMiddleware_1.ensureAuthenticated, bookTransactionRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

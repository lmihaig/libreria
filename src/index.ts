import express, { Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import db from './db/drizzle';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { users } from './db/schema';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';
import bookInstanceRouter from './routes/bookInstanceRoutes';
import userRouter from './routes/userRoutes';
import friendshipRouter from './routes/friendshipRoutes';
import readingListRouter from './routes/readingListRoutes';
import { ensureAuthenticated } from './middlewares/authMiddleware';
import bookTransactionRouter from './routes/bookTransactionRoutes'


dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET ?? '', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id)
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  tokenURL: 'https://oauth2.googleapis.com/token',
  clientID: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  callbackURL: '/auth/google/callback',
  state: true,
  passReqToCallback: true
}, async function(request: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.googleId, profile.id)
    });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = await db.insert(users).values({
      googleId: profile.id,
      nickname: profile.displayName
    }).returning();

    return done(null, newUser[0]);
  }
  catch (error) {
    return done(error, null);
  }
}));

// Public routes
app.use('/', authRouter);

// Private routes -
app.use('/book-instances', ensureAuthenticated, bookInstanceRouter);
app.use('/users', ensureAuthenticated, userRouter);
app.use('/friendships', ensureAuthenticated, friendshipRouter);
app.use('/reading-lists', ensureAuthenticated, readingListRouter);
app.use('/book-transactions', ensureAuthenticated, bookTransactionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// types.d.ts

declare global {
  namespace Express {
    interface User {
      id: number;
    }

    interface Request {
      user?: User;
    }
  }
}

export interface UserType {
  id: number;
  googleId: string;
  nickname: string;
}



import type { Request, Response } from 'express';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('access_token', cookieOptions);
  res.status(200).json({ message: 'Logged out successfully.' });
};

export const checkSession = (_req: Request, res: Response): void => {
  res.status(200).json({ authenticated: true });
};
import type { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { doubleCsrf } from 'csrf-csrf';

const getSecret = (): string => {
  const secret = process.env.CSRF_SECRET;

  if (!secret) {
    throw new Error('CSRF_SECRET is not configured.');
  }

  return secret;
};

const getSessionIdentifier = (req: Request): string => {
  const anonymousId = req.cookies?.csrf_anonymous_id;

  if (
    typeof anonymousId === 'string' &&
    /^[a-f0-9]{64}$/.test(anonymousId)
  ) {
    return `anonymous:${anonymousId}`;
  }

  throw new Error('Anonymous CSRF identifier is missing.');
};


export const ensureAnonymousCsrfId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let anonymousId = req.cookies?.csrf_anonymous_id;

  if (
    typeof anonymousId !== 'string' ||
    !/^[a-f0-9]{64}$/.test(anonymousId)
  ) {
    anonymousId = randomBytes(32).toString('hex');

    res.cookie('csrf_anonymous_id', anonymousId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });

    req.cookies = req.cookies ?? {};
    req.cookies.csrf_anonymous_id = anonymousId;
  }

  next();
};


export const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret,
  getSessionIdentifier,
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
});


import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.access_token;

  if (typeof token !== 'string' || !token) {
    res.status(401).json({
      message: 'Authentication required. Please log in.',
    });
    return;
  }

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    console.error('SECRET_KEY is not configured.');
    res.status(500).json({
      message: 'An unexpected server error occurred.',
    });
    return;
  }

  try {
    jwt.verify(token, secretKey, {
      algorithms: ['HS256'],
    });

    next();
  } catch {
    res.status(401).json({
      message: 'Invalid or expired authentication session.',
    });
  }
};


import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authenticate = async (): Promise<void> => {
    try {
      const { username, password } = req.body;

      const storedUsername = process.env.ADMIN_USERNAME;
      const passwordHash = process.env.ADMIN_PASSWORD_HASH;
      const secretKey = process.env.SECRET_KEY;

      if (!storedUsername || !passwordHash || !secretKey) {
        console.error('Required authentication configuration is missing.');
        res.status(500).json({
          message: 'An unexpected server error occurred.',
        });
        return;
      }

      if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        username !== storedUsername ||
        !(await bcrypt.compare(password, passwordHash))
      ) {
        res.status(401).json({
          message: 'Invalid username or password',
        });
        return;
      }

      const token = jwt.sign(
        { username },
        secretKey,
        {
          expiresIn: '1h',
          algorithm: 'HS256',
        },
      );

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  };

  void authenticate();
};
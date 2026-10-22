
import type { Request, Response, NextFunction } from 'express';

interface DatabaseError extends Error {
  code?: string;
  constraint?: string;
}

const errorHandler = (
  err: DatabaseError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Request error:', {
    method: req.method,
    path: req.path,
    message: err.message,
    code: err.code,
  });

  if (res.headersSent) {
    next(err);
    return;
  }

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    res.status(409).json({
      message: 'A record with this information already exists.',
    });
    return;
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    res.status(409).json({
      message: 'This operation conflicts with an existing record.',
    });
    return;
  }

  // PostgreSQL not-null constraint violation
  if (err.code === '23502') {
    res.status(400).json({
      message: 'A required field is missing.',
    });
    return;
  }

  // Unexpected errors: do not expose internal details
  res.status(500).json({
    message: 'An unexpected server error occurred.',
  });
};

export default errorHandler;
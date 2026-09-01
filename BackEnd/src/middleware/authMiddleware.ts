import {
  Request,
  Response,
  NextFunction,
} from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Access denied. Token missing.",
    });
    return;
  }

  try {
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    );

    next();
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      res.status(401).json({
        message: "Invalid username or password",
      });
      return;
    }

    const token = jwt.sign(
      {
        username,
      },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};
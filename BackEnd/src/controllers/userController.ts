import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM users");

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, phone, gender } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, gender)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, gender],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, gender } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           phone = $3,
           gender = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, phone, gender, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
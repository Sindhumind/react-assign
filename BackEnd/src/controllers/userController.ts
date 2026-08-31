import type { Request, Response, NextFunction } from "express";
import pool from "../config/db";

// Get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id ASC",
    );

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

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

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, phone, gender } = req.body;

    const profilePhoto = req.file
      ? req.file.filename
      : null;

    const result = await pool.query(
      `INSERT INTO users (
        name,
        email,
        phone,
        gender,
        profile_photo
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        name,
        email,
        phone,
        gender,
        profilePhoto,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const profilePhoto = req.file
      ? req.file.filename
      : null;

    let result;

    // If a new image is uploaded
    if (profilePhoto) {
      result = await pool.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             phone = $3,
             gender = $4,
             profile_photo = $5
         WHERE id = $6
         RETURNING *`,
        [
          name,
          email,
          phone,
          gender,
          profilePhoto,
          id,
        ],
      );
    } else {
      // If no new image is uploaded
      result = await pool.query(
        `UPDATE users
         SET name = $1,
             email = $2,
             phone = $3,
             gender = $4
         WHERE id = $5
         RETURNING *`,
        [
          name,
          email,
          phone,
          gender,
          id,
        ],
      );
    }

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    console.log("UPDATED USER:", result.rows[0]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

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

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
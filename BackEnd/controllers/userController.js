const db = require("../config/db");

// GET all users
const getUsers = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM users");

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET user by ID
const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const result = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// CREATE user
const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, gender } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const result = await db.query(
      `INSERT INTO users (name, email, phone, gender)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, gender]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// UPDATE user
const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, gender } = req.body;

    const result = await db.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           phone = $3,
           gender = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, phone, gender, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE user
const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
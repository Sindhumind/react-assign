import db from '../config/db';

// Get all users
export const getUsers = async () => {
  const result = await db.query('SELECT * FROM users');

  return result.rows;
};

// Get user by ID
export const getUserById = async (id: number) => {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id],
  );

  return result.rows[0] || null;
};

// Create user
export const createUser = async (
  name: string,
  email: string,
  phone: string,
  gender: string,
  address: string,
  profilePhoto: string | null,
) => {
  const result = await db.query(
    `INSERT INTO users (
      name,
      email,
      phone,
      gender,
      address,
      profile_photo
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      name,
      email,
      phone,
      gender,
      address,
      profilePhoto,
    ],
  );

  return result.rows[0];
};

// Update user
export const updateUser = async (
  id: number,
  name: string,
  email: string,
  phone: string,
  gender: string,
  address: string,
  profilePhoto: string | null,
) => {
  const result = await db.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         phone = $3,
         gender = $4,
         address = $5,
         profile_photo = COALESCE($6, profile_photo)
     WHERE id = $7
     RETURNING *`,
    [
      name,
      email,
      phone,
      gender,
      address,
      profilePhoto,
      id,
    ],
  );

  return result.rows[0] || null;
};

// Delete user
export const deleteUser = async (id: number) => {
  const result = await db.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id],
  );

  return result.rows[0] || null;
};
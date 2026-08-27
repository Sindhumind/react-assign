require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "user_management",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;


pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("Database connected:", result.rows[0]);
  }
});
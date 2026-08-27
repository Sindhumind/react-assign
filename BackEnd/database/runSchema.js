require("dotenv").config();

const fs = require("fs");
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "user_management",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createTables() {
  try {
    const sql = fs.readFileSync("./database/schema.sql", "utf8");

    await client.connect();

    await client.query(sql);

    console.log("Users table created successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

createTables();
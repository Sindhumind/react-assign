import dotenv from "dotenv";
import fs from "fs";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "user_management",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

async function createTables(): Promise<void> {
  try {
    const sql = fs.readFileSync("./database/schema.sql", "utf8");

    await client.connect();

    await client.query(sql);

    console.log("Users table created successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

createTables();
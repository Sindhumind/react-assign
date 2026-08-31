import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function runMigrations() {
  try {
    // Create migration tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Find migration files
    const migrationsPath = path.join(__dirname, "../migrations");

    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      // Check if migration already ran
      const result = await pool.query(
        "SELECT * FROM migrations WHERE filename = $1",
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`${file} already executed`);
        continue;
      }

      // Read SQL file
      const sql = fs.readFileSync(
        path.join(migrationsPath, file),
        "utf8"
      );

      // Run SQL
      await pool.query(sql);

      // Save migration history
      await pool.query(
        "INSERT INTO migrations (filename) VALUES ($1)",
        [file]
      );

      console.log(`${file} executed successfully`);
    }

    console.log("All migrations completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigrations();
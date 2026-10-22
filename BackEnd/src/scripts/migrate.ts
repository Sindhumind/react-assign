
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pool from '../config/db';

dotenv.config();

async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsPath = path.join(__dirname, '../migrations');

    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const result = await client.query(
        'SELECT 1 FROM migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`${file} already executed`);
        continue;
      }

      const sql = fs.readFileSync(
        path.join(migrationsPath, file),
        'utf8'
      );

      console.log(`Running migration: ${file}`);

      await client.query('BEGIN');

      try {
        await client.query(sql);

        await client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        );

        await client.query('COMMIT');

        console.log(`${file} executed successfully`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${String(error)}`);
      }
    }

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();

    try {
      await pool.end();
    } catch (error) {
      console.error('Failed to close database pool:', error);
      process.exitCode = 1;
    }
  }
}

runMigrations().catch((error: unknown) => {
  console.error('Unexpected migration error:', error);
  process.exitCode = 1;
});

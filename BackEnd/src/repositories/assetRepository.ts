import db from '../config/db';

export const createAsset = async (
  originalFilename: string,
  storedFilename: string,
  filePath: string,
  mimeType: string,
  fileSize: number,
  uploadedBy: number,
) => {
  const result = await db.query(
    `INSERT INTO assets (
      original_filename,
      stored_filename,
      file_path,
      mime_type,
      file_size,
      uploaded_by
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      originalFilename,
      storedFilename,
      filePath,
      mimeType,
      fileSize,
      uploadedBy,
    ],
  );

  return result.rows[0];
};
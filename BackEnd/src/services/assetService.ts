import * as assetRepository from '../repositories/assetRepository';

export const createAsset = async (
  originalFilename: string,
  storedFilename: string,
  filePath: string,
  mimeType: string,
  fileSize: number,
  uploadedBy: number,
) => {
  return assetRepository.createAsset(
    originalFilename,
    storedFilename,
    filePath,
    mimeType,
    fileSize,
    uploadedBy,
  );
};
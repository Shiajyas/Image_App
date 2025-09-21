

export interface IFileStorageService {
  /**
   * Returns the S3 URL of an uploaded file.
   * @param file - The uploaded file from multer-s3
   */
  getFileUrl(file: Express.MulterS3.File): string;

  /**
   * Optional: multer instance for handling uploads
   */
  upload: import("multer").Multer;
}

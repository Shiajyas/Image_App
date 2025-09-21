import { injectable } from "tsyringe";
import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../utils/s3Client";


const bucketName = process.env.AWS_S3_BUCKET_NAME || "";

console.log(bucketName, "bucketName");

export interface IFileStorageService {
  upload: multer.Multer;
  getFileUrl(file: Express.MulterS3.File): string;
}

@injectable()
export class FileStorageService implements IFileStorageService {
  public upload: multer.Multer;

  constructor() {
    this.upload = multer({
      storage: multerS3({
        s3,
        bucket: bucketName,
        acl: "private", // keep private; use signed URLs to access
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (_, file, cb) => cb(null, { fieldName: file.fieldname }),
        key: (_, file, cb) => cb(null, `uploads/${Date.now()}_${file.originalname}`),
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
      fileFilter: (_, file, cb) => {
        const allowed = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "video/mp4",
          "video/webm",
          "video/ogg",
          "application/pdf",
        ];
        cb(null, allowed.includes(file.mimetype));
      },
    });
  }

  getFileUrl(file: Express.MulterS3.File) {
    return file.location;
  }
}

import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path"; // Use ES6 import for path

class S3Service {
  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME;

    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: process.env.AWS_ENDPOINT,
      forcePathStyle: true,
    });

    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // MIME types for images, PDFs, videos
        const allowedMimes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "video/mp4",
          "video/mpeg",
        ];

        // Extensions for documents
        const allowedExtensions = [
          ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".csv",
          ".jpeg", ".jpg", ".png", ".gif", ".webp", ".mp4", ".mpeg"
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        // Accept if MIME is allowed OR extension is allowed (handles browsers sending weird MIME types)
        if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error(
            "Invalid file type. Allowed: images, PDF, Word, Excel, PowerPoint, CSV, MP4/MPEG videos"
          ), false);
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
    });
  }

  getUploadMiddleware() {
    return this.upload;
  }

  async getObjectStream(key) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const { Body } = await this.s3.send(command);
    return Body;
  }

  async deleteObject(key) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3.send(command);
  }
}

export default S3Service;

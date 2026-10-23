import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

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
        const allowedMimes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "video/mp4",
          "video/mpeg",
        ];

        const allowedExtensions = [
          ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".csv",
          ".jpeg", ".jpg", ".png", ".gif", ".webp", ".mp4", ".mpeg"
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error(
            "Invalid file type. Allowed: images, PDF, Word, Excel, PowerPoint, CSV, MP4/MPEG videos"
          ), false);
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    });
  }

  getUploadMiddleware() {
    return this.upload;
  }

  async uploadBuffer(key, buffer, contentType = "application/pdf") {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "private"
    });

    await this.s3.send(command);
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async getPresignedUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async getObjectStream(key) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return this.s3.send(command);
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

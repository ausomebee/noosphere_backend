import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

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
      })
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
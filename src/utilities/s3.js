import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

class S3Service {
  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME;

    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_ENDPOINT,
      s3ForcePathStyle: true,
    });

    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucketName,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          cb(null, Date.now().toString() + "-" + file.originalname);
        },
      }),
    });
  }

  getUploadMiddleware() {
    return this.upload;
  }

  getKey(key) {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: key,
    };
    return this.s3.getObject(downloadParams).createReadStream();
  }

  deleteImage(key) {
    this.s3.deleteObject(
      {
        Bucket: this.bucketName,
        Key: key,
      },
      (err, data) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully:", data);
        }
      }
    );
  }
}

export default S3Service;
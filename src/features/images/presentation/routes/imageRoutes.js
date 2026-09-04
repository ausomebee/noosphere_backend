import express from "express";
import S3Service from "../../../../utilities/s3.js";
import { adminProtect, clientProtect, staffProtect } from "../../../../middleware/auth_handlers.js";

class ImageRoutes {
  constructor() {
    this.router = express.Router();
    this.s3Service = new S3Service();
    this.S3Service = this.s3Service.getUploadMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /api/v1/images/upload:
     *   post:
     *     summary: Upload multiple images to S3
     *     tags: [Images]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *             required:
     *               - images
     *     responses:
     *       201:
     *         description: Images uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       filename:
     *                         type: string
     *                       url:
     *                         type: string
     *       400:
     *         description: No images provided or validation error
     *       500:
     *         description: Server error during upload
     */
    this.router.post("/upload", staffProtect(), this.S3Service.array("images", 10), this.uploadImages.bind(this));

    /**
     * @swagger
     * /api/v1/images/admin/upload:
     *   post:
     *     summary: Upload multiple images to S3
     *     tags: [Images]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *             required:
     *               - images
     *     responses:
     *       201:
     *         description: Images uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       filename:
     *                         type: string
     *                       url:
     *                         type: string
     *       400:
     *         description: No images provided or validation error
     *       500:
     *         description: Server error during upload
     */
    this.router.post("/admin/upload", adminProtect(), this.S3Service.array("images", 10), this.uploadImages.bind(this));

    /**
     * @swagger
     * /api/v1/images/client/upload:
     *   post:
     *     summary: Upload multiple images to S3
     *     tags: [Images]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               images:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *             required:
     *               - images
     *     responses:
     *       201:
     *         description: Images uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       filename:
     *                         type: string
     *                       url:
     *                         type: string
     *       400:
     *         description: No images provided or validation error
     *       500:
     *         description: Server error during upload
     */
    this.router.post("/client/upload", clientProtect(), this.S3Service.array("images", 10), this.uploadImages.bind(this));

    /**
     * @swagger
     * /api/v1/images/presigned-url:
     *   get:
     *     summary: Get a presigned URL for an S3 object
     *     tags: [Images]
     *     parameters:
     *       - in: query
     *         name: key
     *         required: true
     *         schema:
     *           type: string
     *         description: The S3 object key to generate a presigned URL for
     *       - in: query
     *         name: expiresIn
     *         required: false
     *         schema:
     *           type: integer
     *         description: URL expiry in seconds (default 3600)
     *     responses:
     *       200:
     *         description: Presigned URL generated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                   properties:
     *                     key:
     *                       type: string
     *                     url:
     *                       type: string
     *                     expiresIn:
     *                       type: integer
     *       400:
     *         description: Missing or invalid key
     *       500:
     *         description: Server error while generating presigned URL
     */
    this.router.get("/presigned-url", staffProtect(), this.getPresignedUrl.bind(this));

    /**
     * @swagger
     * /api/v1/images/admin/presigned-url:
     *   get:
     *     summary: Get a presigned URL for an S3 object
     *     tags: [Images]
     *     parameters:
     *       - in: query
     *         name: key
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: expiresIn
     *         required: false
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Presigned URL generated successfully
     *       400:
     *         description: Missing or invalid key
     *       500:
     *         description: Server error while generating presigned URL
     */
    this.router.get("/admin/presigned-url", adminProtect(), this.getPresignedUrl.bind(this));

    /**
     * @swagger
     * /api/v1/images/client/presigned-url:
     *   get:
     *     summary: Get a presigned URL for an S3 object
     *     tags: [Images]
     *     parameters:
     *       - in: query
     *         name: key
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: expiresIn
     *         required: false
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Presigned URL generated successfully
     *       400:
     *         description: Missing or invalid key
     *       500:
     *         description: Server error while generating presigned URL
     */
    this.router.get("/client/presigned-url", clientProtect(), this.getPresignedUrl.bind(this));
  }

  async uploadImages(req, res) {
    try {
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No images provided",
        });
      }

      // Map uploaded files to return filename and URL
      const uploadedImages = req.files.map((file) => ({
        filename: file.originalname,
        url: file.location, // Provided by multer-s3 (S3 URL)
      }));

      return res.status(201).json({
        success: true,
        data: uploadedImages,
      });
    } catch (error) {
      console.error("Error uploading images:", error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to upload images: " + error.message,
      });
    }
  }

  async getPresignedUrl(req, res) {
    try {
      const { key, expiresIn } = req.query;

      if (!key || typeof key !== "string") {
        return res.status(400).json({
          success: false,
          error: "S3 key is required",
        });
      }

      const parsedExpiresIn = expiresIn ? Number(expiresIn) : 3600;

      if (!Number.isInteger(parsedExpiresIn) || parsedExpiresIn <= 0 || parsedExpiresIn > 604800) {
        return res.status(400).json({
          success: false,
          error: "expiresIn must be a positive integer no greater than 604800 seconds (7 days)",
        });
      }

      const url = await this.s3Service.getPresignedUrl(key, parsedExpiresIn);

      return res.status(200).json({
        success: true,
        data: { key, url, expiresIn: parsedExpiresIn },
      });
    } catch (error) {
      console.error("Error generating presigned URL:", error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to generate presigned URL: " + error.message,
      });
    }
  }

  getRouter() {
        return this.router;
    }

}

export default new ImageRoutes().getRouter();
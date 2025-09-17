import express from "express";
import S3Service from "../../../../utilities/s3.js";

class ImageRoutes {
  constructor() {
    this.router = express.Router();
    this.S3Service = new S3Service().getUploadMiddleware();
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
    this.router.post("/upload", this.S3Service.array("images", 10), this.uploadImages.bind(this));
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

  getRouter() {
        return this.router;
    }

}

export default new ImageRoutes().getRouter();
import express from 'express';
import { adminProtect } from '../../../../middleware/auth_handlers.js';
import ProspectController from '../controllers/prospectController.js';
import ProspectDto from '../dto/prospectDto.js';

class ProspectRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new ProspectController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/prospect/send-email:
         *   post:
         *     summary: Send an email to a prospect
         *     tags: [Prospect]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [to, subject, body]
         *             properties:
         *               to:
         *                 type: string
         *                 format: email
         *               subject:
         *                 type: string
         *                 maxLength: 200
         *               body:
         *                 type: string
         *                 maxLength: 10000
         *     responses:
         *       200:
         *         description: Prospect email sent successfully
         *       400:
         *         description: Validation error
         *       401:
         *         description: Unauthorized
         */
        this.router.post('/send-email', adminProtect(), ProspectDto.sendEmailDto, this.controller.sendEmail);
    }

    getRouter() {
        return this.router;
    }
}

export default new ProspectRoutes().getRouter();

import express from "express";
import StaffAvailabilityController from "../controller/staffAvailabilityController.js";
import StaffAvailabilityDto from "../dto/staffAvailabilityDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     StaffAvailabilityCreateDto:
 *       type: object
 *       required:
 *         - staffId
 *         - availabilityDays
 *       properties:
 *         staffId:
 *           type: string
 *           format: uuid
 *         availabilityDays:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dayOfWeek:
 *                 type: string
 *               available:
 *                 type: boolean
 *               from:
 *                 type: string
 *                 example: "09:00"
 *               to:
 *                 type: string
 *                 example: "17:00"
 *
 *     StaffAvailabilityUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - availabilityDays
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         availabilityDays:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               dayOfWeek:
 *                 type: string
 *               available:
 *                 type: boolean
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 */

class StaffAvailabilityRoutes {
    constructor() {
        this.controller = new StaffAvailabilityController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/staff-availability:
         *   post:
         *     summary: Create staff availability
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/StaffAvailabilityCreateDto'
         *     responses:
         *       201:
         *         description: Staff availability created successfully
         */
        this.router.post(
            "/",
            staffProtect,
            StaffAvailabilityDto.createStaffAvailabilityDto,
            this.controller.createStaffAvailability
        );

        /**
         * @swagger
         * /api/v1/organization/staff-availability:
         *   put:
         *     summary: Update staff availability
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/StaffAvailabilityUpdateDto'
         *     responses:
         *       201:
         *         description: Staff availability updated successfully
         */
        this.router.put(
            "/",
            staffProtect,
            StaffAvailabilityDto.updateStaffAvailabilityDto,
            this.controller.updateStaffAvailability
        );

        /**
         * @swagger
         * /api/v1/organization/staff-availability/{id}:
         *   get:
         *     summary: Get a single staff availability
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Staff availability ID
         *     responses:
         *       200:
         *         description: Staff availability fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect,
            this.controller.getSingleStaffAvailability
        );

        /**
         * @swagger
         * /api/v1/organization/staff-availability/staff/{staffId}:
         *   get:
         *     summary: Get all availability records for a staff
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: staffId
         *         required: true
         *         schema:
         *           type: string
         *         description: Staff ID
         *     responses:
         *       200:
         *         description: Staff availabilities fetched successfully
         */
        this.router.get(
            "/staff/:staffId",
            staffProtect,
            this.controller.getStaffAvailabilities
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new StaffAvailabilityRoutes().getRouter();

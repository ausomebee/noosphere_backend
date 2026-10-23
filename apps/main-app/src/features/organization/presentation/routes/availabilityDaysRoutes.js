import express from "express";
import AvailabilityDaysController from "../controller/availabilityDaysController.js";
import AvailabilityDaysDto from "../dto/availabilityDaysDto.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailabilityDaysCreateDto:
 *       type: object
 *       required:
 *         - dayOfWeek
 *         - available
 *         - from
 *         - to
 *         - availabilityId
 *       properties:
 *         dayOfWeek:
 *           type: string
 *           example: "Monday"
 *         available:
 *           type: boolean
 *           example: true
 *         from:
 *           type: string
 *           example: "09:00"
 *         to:
 *           type: string
 *           example: "17:00"
 *         availabilityId:
 *           type: string
 *           format: uuid
 *
 *     AvailabilityDaysUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         dayOfWeek:
 *           type: string
 *         available:
 *           type: boolean
 *         from:
 *           type: string
 *         to:
 *           type: string
 */

class AvailabilityDaysRoutes {
    constructor() {
        this.controller = new AvailabilityDaysController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/availability-days:
         *   post:
         *     summary: Create an availability day record
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AvailabilityDaysCreateDto'
         *     responses:
         *       201:
         *         description: Availability day created successfully
         */
        this.router.post(
            "/",
            staffProtect(),
            AvailabilityDaysDto.createAvailabilityDayDto,
            this.controller.createAvailabilityDay
        );

        /**
         * @swagger
         * /api/v1/organization/availability-days:
         *   put:
         *     summary: Update an availability day
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AvailabilityDaysUpdateDto'
         *     responses:
         *       201:
         *         description: Availability day updated successfully
         */
        this.router.put(
            "/",
            staffProtect(),
            AvailabilityDaysDto.updateAvailabilityDayDto,
            this.controller.updateAvailabilityDay
        );

        /**
         * @swagger
         * /api/v1/organization/availability-days/{id}:
         *   get:
         *     summary: Get a single availability day
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: Availability day ID
         *     responses:
         *       200:
         *         description: Availability day fetched successfully
         */
        this.router.get(
            "/:id",
            staffProtect(),
            this.controller.getSingleAvailabilityDay
        );

        /**
         * @swagger
         * /api/v1/organization/availability-days/availability/{availabilityId}:
         *   get:
         *     summary: Get all availability days for a given availabilityId
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: availabilityId
         *         schema:
         *           type: string
         *         required: true
         *         description: The availability ID (foreign key)
         *     responses:
         *       200:
         *         description: Availability days fetched successfully
         */
        this.router.get(
            "/availability/:availabilityId",
            staffProtect(),
            this.controller.getAvailabilityDays
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new AvailabilityDaysRoutes().getRouter();

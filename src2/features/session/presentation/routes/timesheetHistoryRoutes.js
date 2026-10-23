import express from "express";
import TimesheetHistoryController from "../controllers/timesheetHistoryController.js";
import TimesheetHistoryDto from "../dto/timesheetHistoryDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     TimesheetHistoryCreateDto:
 *       type: object
 *       required:
 *         - sessionId
 *         - action
 *         - createdBy
 *       properties:
 *         sessionId:
 *           type: string
 *           format: uuid
 *           example: "b3c2f1e4-1234-5678-9101-abcdef123456"
 *         action:
 *           type: string
 *           example: "Session started"
 *         details:
 *           type: string
 *           example: "Started session with client X"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: "f1a2b3c4-5678-9101-1121-abcdef123456"
 *
 *     TimesheetHistoryUpdateDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         action:
 *           type: string
 *         details:
 *           type: string
 */

class TimesheetHistoryRoutes {
    constructor() {
        this.controller = new TimesheetHistoryController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/sessions-timesheet-history:
         *   post:
         *     summary: Create a timesheet history record
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TimesheetHistoryCreateDto'
         *     responses:
         *       201:
         *         description: Timesheet history created successfully
         */
        this.router.post(
            "/",
            TimesheetHistoryDto.createTimesheetHistoryDto,
            this.controller.createTimesheetHistory
        );

        /**
         * @swagger
         * /api/v1/sessions-timesheet-history:
         *   put:
         *     summary: Update a timesheet history record
         *     tags: [sessions]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/TimesheetHistoryUpdateDto'
         *     responses:
         *       200:
         *         description: Timesheet history updated successfully
         */
        this.router.put(
            "/",
            TimesheetHistoryDto.updateTimesheetHistoryDto,
            this.controller.updateTimesheetHistory
        );

        /**
         * @swagger
         * /api/v1/sessions-timesheet-history/{id}:
         *   get:
         *     summary: Get a single timesheet history record
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: TimesheetHistory ID
         *     responses:
         *       200:
         *         description: Timesheet history fetched successfully
         */
        this.router.get(
            "/:id",
            this.controller.getSingleTimesheetHistory
        );

        /**
         * @swagger
         * /api/v1/sessions-timesheet-history/session/{sessionId}:
         *   get:
         *     summary: Get all timesheet history records for a specific session
         *     tags: [sessions]
         *     parameters:
         *       - in: path
         *         name: sessionId
         *         schema:
         *           type: string
         *           format: uuid
         *         required: true
         *         description: Session ID (foreign key)
         *     responses:
         *       200:
         *         description: Timesheet histories fetched successfully
         */
        this.router.get(
            "/session/:sessionId",
            this.controller.getTimesheetHistories
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new TimesheetHistoryRoutes().getRouter();

import express from "express";
import RoundingRulesDto from "../dto/roundingRulesDto.js";
import RoundingRulesController from "../controllers/roundingRulesController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     RoundingRulesCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - ruleType
 *         - ruleName
 *         - standardUnit
 *         - roundingRule
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         ruleType:
 *           type: string
 *           description: Type of rounding rule
 *           example: "time-based"
 *         ruleName:
 *           type: string
 *           description: Name of the rounding rule
 *           example: "15-minute rounding"
 *         description:
 *           type: string
 *           description: Description of the rounding rule
 *           example: "Rounds all service durations to the nearest 15 minutes"
 *         standardUnit:
 *           type: integer
 *           description: Standard unit to apply rounding
 *           example: 15
 *         roundingRule:
 *           type: object
 *           description: JSON definition of the rounding rule
 *           example: { "method": "nearest", "unit": 15 }
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         isActive:
 *           type: boolean
 *           default: true
 *
 *     RoundingRulesUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique rounding rule id
 *         tenantId:
 *           type: string
 *           format: uuid
 *         ruleType:
 *           type: string
 *         ruleName:
 *           type: string
 *         description:
 *           type: string
 *         standardUnit:
 *           type: integer
 *         roundingRule:
 *           type: object
 *         isDeleted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 */

class RoundingRulesRoutes {
    constructor() {
        this.controller = new RoundingRulesController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/rounding-rules:
         *   post:
         *     summary: Create rounding rule
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RoundingRulesCreateDto'
         *     responses:
         *       201:
         *         description: Rounding rule created successfully
         */
        this.router.post("/", RoundingRulesDto.createRoundingRuleDto, this.controller.createRoundingRule);

        /**
         * @swagger
         * /api/v1/organization/rounding-rules:
         *   put:
         *     summary: Update rounding rule
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RoundingRulesUpdateDto'
         *     responses:
         *       201:
         *         description: Rounding rule updated successfully
         */
        this.router.put("/", RoundingRulesDto.updateRoundingRuleDto, this.controller.updateRoundingRule);

        /**
         * @swagger
         * /api/v1/organization/rounding-rules/tenant/{tenantId}:
         *   get:
         *     summary: Get all rounding rules for a tenant
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: tenantId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of rounding rules
         */
        this.router.get("/tenant/:tenantId", this.controller.getTenantRoundingRules);

        /**
         * @swagger
         * /api/v1/organization/rounding-rules/{id}:
         *   get:
         *     summary: Get a single rounding rule
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Rounding rule fetched successfully
         */
        this.router.get("/:id", this.controller.getSingleRoundingRule);

        /**
         * @swagger
         * /api/v1/organization/rounding-rules/{id}:
         *   delete:
         *     summary: Delete rounding rule
         *     tags: [organization]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Rounding rule deleted successfully
         */
        this.router.delete("/:id", this.controller.deleteRoundingRule);
    }

    getRouter() {
        return this.router;
    }
}

export default new RoundingRulesRoutes().getRouter();

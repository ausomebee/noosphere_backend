import express from "express";
import DomainController from "../controllers/domainController.js";
import DomainDto from "../dto/domainDto.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DomainType:
 *       type: string
 *       enum:
 *         - SKILL_ACQUISITION
 *         - BEHAVIOR_REDUCTION
 *
 *     CreateDomainDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - tenantId
 *         - domainType
 *       properties:
 *         name:
 *           type: string
 *           example: "Communication"
 *         description:
 *           type: string
 *           example: "Targets related to communication skills."
 *         tenantId:
 *           type: string
 *           format: uuid
 *           example: "a6a1e2f2-4b77-4c7e-9c30-1b2d3f4a5c6d"
 *         domainType:
 *           $ref: '#/components/schemas/DomainType'
 *
 *     UpdateDomainDto:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "d2f9b3c1-1234-4abc-9f00-abcdef123456"
 *         name:
 *           type: string
 *           example: "Communication"
 *         description:
 *           type: string
 *           example: "Targets related to communication skills."
 *         domainType:
 *           $ref: '#/components/schemas/DomainType'
 */

class DomainRoutes {
    constructor() {
        this.controller = new DomainController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/domains:
         *   post:
         *     summary: Create Domain
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateDomainDto'
         *     responses:
         *       201:
         *         description: Domain created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", DomainDto.createDomainDto, this.controller.createDomain);

        /**
         * @swagger
         * /api/v1/domains:
         *   patch:
         *     summary: Update Domain
         *     tags: [program]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateDomainDto'
         *     responses:
         *       201:
         *         description: Domain updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.patch("/", DomainDto.updateDomainDto, this.controller.updateDomain);

        /**
        * @swagger
        * /api/v1/domains/{tenantId}:
        *   get:
        *     summary: gets tenant domains
        *     tags: [program]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The tenant ID of the Domain
        *     responses:
        *       200:
        *         description: Domains fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:tenantId", this.controller.getAllTenantDomain);

    }

    getRouter() {
        return this.router;
    }
}

export default new DomainRoutes().getRouter();
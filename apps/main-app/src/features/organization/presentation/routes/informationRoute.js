import express from "express";
import InformationDto from "../dto/informationDto.js";
import InformationController from "../controller/informationController.js";
import { staffProtect } from "../../../../middleware/auth_handlers.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     InformationCreateDto:
 *       type: object
 *       required:
 *         - tenantId
 *         - name
 *         - email
 *         - phoneNumber
 *         - website
 *         - practiceNPI
 *         - streetAddress
 *         - city
 *         - state
 *         - country
 *         - zipCode
 *       properties:
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Full name
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         phoneNumber:
 *           type: string
 *           description: Phone number with country code
 *           example: "+2348012345678"
 *         website:
 *           type: string
 *           format: uri
 *           description: Website URL
 *         practiceNPI:
 *           type: string
 *           description: Practice NPI (alphanumeric)
 *         streetAddress:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State name
 *         country:
 *           type: string
 *           description: Country name
 *         zipCode:
 *           type: string
 *           description: Zip or postal code
 *
 *     InformationUpdateDto:
 *       type: object
 *       required:
 *         - id
 *         - tenantId
 *         - name
 *         - email
 *         - phoneNumber
 *         - website
 *         - practiceNPI
 *         - streetAddress
 *         - city
 *         - state
 *         - country
 *         - zipCode
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the record
 *         tenantId:
 *           type: string
 *           format: uuid
 *           description: Unique tenant identifier
 *         name:
 *           type: string
 *           description: Full name
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         phoneNumber:
 *           type: string
 *           description: Phone number with country code
 *           example: "+2348012345678"
 *         website:
 *           type: string
 *           format: uri
 *           description: Website URL
 *         practiceNPI:
 *           type: string
 *           description: Practice NPI (alphanumeric)
 *         streetAddress:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State name
 *         country:
 *           type: string
 *           description: Country name
 *         zipCode:
 *           type: string
 *           description: Zip or postal code
 */

class InformationRoutes {
    constructor() {
        this.controller = new InformationController();
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/v1/organization/information:
         *   post:
         *     summary: Create organization information
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/InformationCreateDto'
         *     responses:
         *       201:
         *         description: Organization information created successfully
         *       400:
         *         description: Validation error
         */
        this.router.post("/", staffProtect(), InformationDto.createInformationDto, this.controller.createInformation);

        /**
         * @swagger
         * /api/v1/organization/information:
         *   put:
         *     summary: Update organization information
         *     tags: [organization]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/InformationUpdateDto'
         *     responses:
         *       201:
         *         description: Organization information updated successfully
         *       400:
         *         description: Validation error
         */
        this.router.put("/", staffProtect(), InformationDto.updateInformationDto, this.controller.updateInformation);

        /**
        * @swagger
        * /api/v1/organization/information/{tenantId}:
        *   get:
        *     summary: gets tenant organization information
        *     tags: [organization]
        *     parameters:
        *       - in: path
        *         name: tenantId
        *         required: true
        *         schema:
        *           type: string
        *         description: The Id of the tenant
        *     responses:
        *       200:
        *         description: organization information fetched successfully
        *       400:
        *         description: Validation error
        */
        this.router.get("/:tenantId", staffProtect(), this.controller.getInformation);

    }

    getRouter() {
        return this.router;
    }
}

export default new InformationRoutes().getRouter();
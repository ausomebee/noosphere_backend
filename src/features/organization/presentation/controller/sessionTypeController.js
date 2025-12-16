import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import OrganizationSessionTypesRepository from "../../infrastucture/sessionTypesRepository.js";
import OrganizationSessionTypesService from "../../application/sessionTypeService.js";
import OrganizationSessionType from "../../domain/sessionType.js";
import SessionTypeServiceDomain from "../../domain/sessionTypeService.js";
import SessionTypeServiceRepository from "../../infrastucture/sessionTypeServiceRepository.js";
import SessionTypeServiceService from "../../application/sessionTypeServiceService.js";

class OrganizationSessionTypesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new OrganizationSessionTypesRepository(this.prisma.organizationSessionTypes);
        this.service = new OrganizationSessionTypesService({ organizationSessionTypesRepository: this.repository });
        this.sessionTypeServiceRepository = new SessionTypeServiceRepository(this.prisma.sessionTypeService);
        this.sessionTypeServiceService = new SessionTypeServiceService({ sessionTypeServiceRepository: this.sessionTypeServiceRepository });
    }

    createSessionType = expressAsyncHandler(async (req, res) => {
        const typeData = new OrganizationSessionType(req.body);
        const type = await this.service.createOrganizationSessionType(typeData.createOrganizationSessionTypes);

        if (!type) {
            res.status(500).json({ message: "Failed to create session type" });
        }

        for (const sc of req.body.service || []) {
            const scPayload = new SessionTypeServiceDomain({ ...sc, sessionTypeId: type.id });
            const newSc = await this.sessionTypeServiceService.createSessionTypeService(scPayload.createSessionTypeService);

            if (!newSc) {
                return res.status(500).json({ message: "Failed to create client authorization service" });
            }
        }

        return res.status(201).json({
            message: "Session type created successfully",
            status: "ok",
            data: type,
        });
    });

    updateSessionType = expressAsyncHandler(async (req, res) => {
        const type = await this.service.updateOrganizationSessionType(req.body);

        if (!type) {
            res.status(500).json({ message: "Failed to update session type" });
        }

        return res.status(200).json({
            message: "Session type updated successfully",
            status: "ok",
            data: type,
        });
    });

    getSingleSessionType = expressAsyncHandler(async (req, res) => {
        const type = await this.service.getOrganizationSessionType(req.params.id);

        if (!type) {
            res.status(500).json({ message: "Failed to fetch session type" });
        }

        return res.status(200).json({
            message: "Session type fetched successfully",
            status: "ok",
            data: type,
        });
    });

    getTenantSessionTypes = expressAsyncHandler(async (req, res) => {
        const types = await this.service.getTenantSessionTypes(req.params.tenantId);

        if (!types) {
            res.status(500).json({ message: "Failed to fetch session types" });
        }

        return res.status(200).json({
            message: "Session types fetched successfully",
            status: "ok",
            data: types,
        });
    });

    getActiveTenantSessionTypes = expressAsyncHandler(async (req, res) => {
        const types = await this.service.getActiveTenantSessionTypes(req.params.tenantId);

        if (!types) {
            res.status(500).json({ message: "Failed to fetch session types" });
        }

        return res.status(200).json({
            message: "Session types fetched successfully",
            status: "ok",
            data: types,
        });
    });

    deactivateSessionType = expressAsyncHandler(async (req, res) => {
        const type = await this.service.updateOrganizationSessionType({ id: req.params.id, isActive: req.params.active === "true" });

        if (!type) {
            res.status(500).json({ message: "Failed to deactivate session type" });
        }

        return res.status(200).json({
            message: "Session type deactivated successfully",
            status: "ok",
            data: type,
        });
    });
}

export default OrganizationSessionTypesController;

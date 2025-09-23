import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import OrganizationSessionTypesRepository from "../../infrastucture/sessionTypesRepository.js";
import OrganizationSessionTypesService from "../../application/sessionTypeService.js";
import OrganizationSessionType from "../../domain/sessionType.js";

class OrganizationSessionTypesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.repository = new OrganizationSessionTypesRepository(this.prisma.organizationSessionTypes);
        this.service = new OrganizationSessionTypesService({ organizationSessionTypesRepository: this.repository });
    }

    createSessionType = expressAsyncHandler(async (req, res) => {
        const typeData = new OrganizationSessionType(req.body);
        const type = await this.service.createOrganizationSessionType(typeData.createOrganizationSessionTypes);

        if (!type) {
            res.status(500).json({ message: "Failed to create session type" });
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

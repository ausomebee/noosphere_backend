import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DomainRepository from "../../infrastructure/domainRepository.js";
import DomainService from "../../application/domainService.js";
import Domain from "../../domain/domain.js";
import auditLogger from "../../../logs/application/auditLogger.js";

class DomainController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.domainRepository = new DomainRepository(this.prisma.domain)
        this.service = new DomainService({ domainRepository: this.domainRepository });
    }

    createDomain = expressAsyncHandler(async (req, res) => {
        const domainData = new Domain(req.body);
        const domain = await this.service.createDomain(domainData.createDomain);

        if (!domain) {
            res.status(500).json({ message: 'Failed to create domain' });
        }

        await auditLogger.log(req, {
            tenantId: domain.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Domain Management",
            action: `created domain ${domain.id}`,
            reason: "Domain management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "domain created successfully",
            status: 'ok',
            data: domain
        });
    });

    updateDomain = expressAsyncHandler(async (req, res) => {
        const domain = await this.service.updateDomain(req.body);

        if (!domain) {
            res.status(500).json({ message: 'Failed to update domain' });
        }

        await auditLogger.log(req, {
            tenantId: domain.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Domain Management",
            action: `updated domain ${domain.id}`,
            reason: "Domain management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "domain updated successfully",
            status: 'ok',
            data: domain
        });
    });

    getAllTenantDomain = expressAsyncHandler(async (req, res) => {
        const domains = await this.service.getAllTenantDomain(req.params.tenantId, req.query.type);

        if (!domains) {
            res.status(500).json({ message: 'Failed to fetch domains' });
        }

        return res.status(201).json({
            message: "domains fetched successfully",
            status: 'ok',
            data: domains
        });
    });

    deleteDomain = expressAsyncHandler(async (req, res) => {
        const domain = await this.service.updateDomain({id: req.params.id, isDeleted: true});

        if (!domain) {
            res.status(500).json({ message: 'Failed to delete domain' });
        }

        await auditLogger.log(req, {
            tenantId: domain.tenantId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Domain Management",
            action: `deleted domain ${domain.id}`,
            reason: "Domain management",
            accessedBy: req.user?.name || null,
        });

        return res.status(201).json({
            message: "domain deleted successfully",
            status: 'ok',
            data: domain
        });
    });
}

export default DomainController;
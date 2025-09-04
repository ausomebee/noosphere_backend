import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import DomainRepository from "../../infrastructure/domainRepository.js";
import DomainService from "../../application/domainService.js";
import Domain from "../../domain/domain.js";

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

        return res.status(201).json({
            message: "domain updated successfully",
            status: 'ok',
            data: domain
        });
    });

    getAllTenantDomain = expressAsyncHandler(async (req, res) => {
        const domains = await this.service.getAllTenantDomain(req.params.tenantId);

        if (!domains) {
            res.status(500).json({ message: 'Failed to fetch domains' });
        }

        return res.status(201).json({
            message: "domains fetched successfully",
            status: 'ok',
            data: domains
        });
    });

}

export default DomainController;
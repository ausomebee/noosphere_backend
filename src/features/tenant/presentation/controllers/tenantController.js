import expressAsyncHandler from "express-async-handler";
import TenantService from "../../application/tenantService.js";
import prismaService from "../../../../config/prisma.js";
import TenantRepository from "../../infrastructure/tenantRepository.js";
import DepartmentRepository from "../../../department/infrastructure/departmentRepository.js";
import RoleRepository from "../../../role/infrastructure/roleRepository.js";
import StaffRepository from "../../infrastructure/staffRepository.js";
import PipelineRepository from "../../../pipeline/infrastructure/pipelineRepository.js";
import ItemRepository from "../../../pipeline/infrastructure/itemRepository.js";

class TenantController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.departmentRepository = new DepartmentRepository(this.prisma.department);
        this.roleRepository = new RoleRepository(this.prisma.role);
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.pipelineRepository = new PipelineRepository(this.prisma.pipeline);
        this.itemRepository = new ItemRepository(this.prisma.pipelineItem);
        this.service = new TenantService({
            tenantRepository: this.tenantRepository,
            prisma: this.prisma,
            departmentRepository: this.departmentRepository,
            roleRepository: this.roleRepository,
            staffRepository: this.staffRepository,
            pipelineRepository: this.pipelineRepository,
            itemRepository: this.itemRepository
        });
    }

    createCandidate = expressAsyncHandler(async (req, res) => {
        const tenant = await this.service.createCandidate(req.body);

        if (!tenant) {
            res.status(500).json({ message: 'Failed to create candidate.' });
        }

        return res.status(201).json({
            message: "Candidate created successfully",
            status: 'ok',
            data: tenant
        });
    });

    updateTenant = expressAsyncHandler(async (req, res) => {
        const tenant = await this.service.updateTenant(req.body);

        if (!tenant) {
            res.status(500).json({ message: 'Failed to update tenant.' });
        }

        return res.status(201).json({
            message: "Candidate updated successfully",
            status: 'ok',
            data: tenant
        });
    });

    getAllTenant = expressAsyncHandler(async (req, res) => {
        const tenants = await this.service.getAllTenant();

        if (!tenants) {
            res.status(500).json({ message: 'Failed to fetch tenants.' });
        }

        return res.status(201).json({
            message: "Tenants fetched successfully",
            status: 'ok',
            data: tenants
        });
    });

    countAllTenant = expressAsyncHandler(async (req, res) => {
        const totalTenants = await this.service.countAllTenant();

        if (!totalTenants) {
            res.status(500).json({ message: 'Failed to fetch tenants.' });
        }

        return res.status(201).json({
            message: "Tenants counted successfully",
            status: 'ok',
            data: totalTenants
        });
    });

    contactTenantByEmail = expressAsyncHandler(async (req, res) => {
        const data = req.file ? {
            ...req.body,
            attachments: req.file
        } : req.body
        const tenant = await this.service.contactTenantByEmail(data);

        if (!tenant) {
            res.status(500).json({ message: 'Failed to contact tenant.' });
        }

        return res.status(201).json({
            message: "Tenant contacted successfully",
            status: 'ok',
            data: tenant
        });
    });

}

export default TenantController;
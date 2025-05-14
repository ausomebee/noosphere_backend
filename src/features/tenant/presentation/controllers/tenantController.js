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

    // createTenantStaff = expressAsyncHandler(async (req, res) => {
    //     const staffData = new Tenant(req.body);
    //     const staff = await this.service.createTenantStaff(staffData.createTenantStaff);

    //     if (!staff) {
    //         res.status(500).json({ message: 'Failed to create tenant staff' });
    //     }

    //     return res.status(201).json({
    //         message: "Tenant staff created successfully",
    //         status: 'ok',
    //         data: staff
    //     });
    // });

    // staffSignin = expressAsyncHandler(async (req, res) => {
    //     const staff = await this.service.staffSignin(req.body);

    //     if (!staff) {
    //         res.status(500).json({ message: 'Failed to signin staff' });
    //     }

    //     return res.status(201).json({
    //         message: "staff login successfully",
    //         status: 'ok',
    //         data: staff
    //     });
    // });

    // getSingleStaff = expressAsyncHandler(async (req, res) => {
    //     const staff = await this.service.getSingleStaff(req.params);

    //     if (!staff) {
    //         res.status(500).json({ message: 'Failed to get staff' });
    //     }

    //     return res.status(201).json({
    //         message: "Staff fetched successfully",
    //         status: 'ok',
    //         data: staff
    //     });
    // });
}

export default TenantController;
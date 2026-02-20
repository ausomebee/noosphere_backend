import expressAsyncHandler from "express-async-handler";
import TenantService from "../../application/tenantService.js";
import prismaService from "../../../../config/prisma.js";
import TenantRepository from "../../infrastructure/tenantRepository.js";
import DepartmentRepository from "../../../departmentAndTeams/infrastructure/departmentRepository.js";
import RoleRepository from "../../../role/infrastructure/roleRepository.js";
import StaffRepository from "../../infrastructure/staffRepository.js";
import PipelineRepository from "../../../pipeline/infrastructure/pipelineRepository.js";
import ItemRepository from "../../../pipeline/infrastructure/itemRepository.js";
import ReferralCodeGenerator from "../../../../utilities/generateCode.js";
import ChoiceRepository from "../../infrastructure/choiceRepository.js";
import AuthRepository from "../../../auth/infrastructure/authRepository.js";
import TokenService from "../../../../utilities/generate_token.js";

class TenantController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.departmentRepository = new DepartmentRepository(this.prisma.department);
        this.roleRepository = new RoleRepository(this.prisma.role);
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.pipelineRepository = new PipelineRepository(this.prisma.pipeline);
        this.itemRepository = new ItemRepository(this.prisma.pipelineItem);
        this.choiceRepository = new ChoiceRepository(this.prisma.tenantAdminChoices);
        this.authRepository = new AuthRepository(this.prisma.auth);
        this.generateCode = new ReferralCodeGenerator(12);
        this.token = TokenService;
        this.service = new TenantService({
            tenantRepository: this.tenantRepository,
            prisma: this.prisma,
            departmentRepository: this.departmentRepository,
            roleRepository: this.roleRepository,
            staffRepository: this.staffRepository,
            pipelineRepository: this.pipelineRepository,
            itemRepository: this.itemRepository,
            generateCode: this.generateCode,
            choiceRepository: this.choiceRepository,
            authRepository: this.prisma.authenticator,
            tokenService: this.token
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

    checkDomain = expressAsyncHandler(async (req, res) => {
        const tenant = await this.service.checkDomain(req.params.subdomain);

        if (!tenant) {
            res.status(500).json({ message: 'Failed to fetch information' });
        }

        return res.status(201).json({
            message: "subdomain checked successfully",
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

    updateTenantAdminChoices = expressAsyncHandler(async (req, res) => {
        const tenantAdminChoices = await this.service.updateTenantAdminChoices(req.body);

        if (!tenantAdminChoices) {
            return res.status(500).json({
                message: 'Failed to update tenant admin choices.'
            });
        }

        return res.status(200).json({
            message: "Tenant admin choices updated successfully",
            status: 'ok',
            data: tenantAdminChoices
        });
    });

    getStaffByPaymentSchedule = expressAsyncHandler(async (req, res) => {
        const staffs = await this.service.getStaffByPaymentSchedule(req.params.tenantId, req.params.paymentSchedule);

        if (!staffs) {
            return res.status(500).json({
                message: 'Failed to fetch staff by payment schedule.'
            });
        }

        return res.status(200).json({
            message: "Staff fetched successfully",
            status: 'ok',
            data: staffs
        });
    });

    getStaffsWithTeamAccess = expressAsyncHandler(async (req, res) => {
        const staffs = await this.service.getStaffsWithTeamAccess(req.params.tenantId);

        if (!staffs) {
            return res.status(500).json({
                message: 'Failed to fetch staff with team access.'
            });
        }

        return res.status(200).json({
            message: "Staff fetched successfully",
            status: 'ok',
            data: staffs
        });
    });

    getStaffPayrollSummary = expressAsyncHandler(async (req, res) => {
        const summary = await this.service.getStaffPayrollSummary(req.params.tenantId);

        if (!summary) {
            return res.status(500).json({
                message: 'Failed to fetch staff payroll summary.'
            });
        }

        return res.status(200).json({
            message: "Staff payroll summary fetched successfully",
            status: 'ok',
            data: summary
        });
    });

    findStaffWithPayrollByTenantAndDateRange = expressAsyncHandler(async (req, res) => {
        const summary = await this.service.findStaffWithPayrollByTenantAndDateRange(req.params.tenantId, req.query.startDate, req.query.endDate, req.query.paymentSchedule);

        if (!summary) {
            return res.status(500).json({
                message: 'Failed to fetch staff payroll summary.'
            });
        }

        return res.status(200).json({
            message: "Staff payroll summary fetched successfully",
            status: 'ok',
            data: summary
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

    availaibleStaffs = expressAsyncHandler(async (req, res) => {
        const count = await this.service.availaibleStaffs(req.params.tenantId);

        if (!count) {
            res.status(500).json({ message: 'Failed to count staffs.' });
        }

        return res.status(201).json({
            message: "staffs counted successfully",
            status: 'ok',
            data: count
        });
    });

    averageClinicians = expressAsyncHandler(async (req, res) => {
        const count = await this.service.averageClinicians(req.params.tenantId);

        if (!count) {
            res.status(500).json({ message: 'Failed to count staffs.' });
        }

        return res.status(201).json({
            message: "staffs counted successfully",
            status: 'ok',
            data: count
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

    createTenantStaff = expressAsyncHandler(async (req, res) => {
        const newStaff = await this.service.createTenantStaff(req.body);

        if (!newStaff) {
            return res.status(500).json({ message: 'Failed to create tenant staff.' });
        }

        return res.status(201).json({
            message: "Tenant staff created successfully",
            status: 'ok',
            data: newStaff
        });
    });

    tenantStaffLogin = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.tenantStaffLogin(req.body);

        if (!staff) {
            return res.status(500).json({ message: 'Failed to login tenant staff.' });
        }

        return res.status(200).json({
            message: "Login successful",
            status: 'ok',
            data: staff
        });
    });

    updateStaffPassword = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.updateStaffPassword(req.body);

        if (!staff) {
            return res.status(500).json({ message: 'Failed to update tenant staff password.' });
        }

        return res.status(200).json({
            message: "Password updated successfully",
            status: 'ok',
            data: staff
        });
    });

    tenantAdminChoices = expressAsyncHandler(async (req, res) => {
        const choice = await this.service.tenantAdminChoices(req.body);

        if (!choice) {
            return res.status(500).json({ message: 'Failed to create tenant admin choices.' });
        }

        return res.status(200).json({
            message: "Choices saved successfully",
            status: 'ok',
            data: choice
        });
    });

    getChoices = expressAsyncHandler(async (req, res) => {
        const choice = await this.service.getChoices(req.params.tenantId);

        if (!choice) {
            return res.status(500).json({ message: 'Failed to get tenant admin choices.' });
        }

        return res.status(200).json({
            message: "Choices retrieved successfully",
            status: 'ok',
            data: choice
        });
    });

    getTenant = expressAsyncHandler(async (req, res) => {
        const tenant = await this.service.getTenant(req.params.id);

        if (!tenant) {
            return res.status(500).json({ message: 'Failed to get tenant.' });
        }

        return res.status(200).json({
            message: "Tenant retrieved successfully",
            status: 'ok',
            data: tenant
        });
    });

    getTenantStaffs = expressAsyncHandler(async (req, res) => {
        const staffs = await this.service.getAllTenantStaffs(req.params.tenantId);

        if (!staffs) {
            return res.status(500).json({ message: 'Failed to get staffs.' });
        }

        return res.status(200).json({
            message: "staffs retrieved successfully",
            status: 'ok',
            data: staffs
        });
    });

    forgotPassword = expressAsyncHandler(async (req, res) => {
        const result = await this.service.forgotPassword(req.params.email);

        if (!result) {
            return res.status(500).json({ message: 'Failed to send mail.' });
        }

        return res.status(200).json({
            message: "Reset link sent to email",
            status: 'ok',
            data: result
        });
    });

    updateStaff = expressAsyncHandler(async (req, res) => {
        const updated = await this.service.updateStaff(req.body);

        if (!updated) {
            return res.status(500).json({ message: 'Failed to update staff.' });
        }

        return res.status(200).json({
            message: "Staff updated successfully",
            status: 'ok',
            data: updated
        });
    });

}

export default TenantController;
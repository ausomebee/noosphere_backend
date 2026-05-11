import expressAsyncHandler from "express-async-handler";
import MailService from "../../../../utilities/nodemailer.js";
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
import ClientRepository from "../../../client/infrastructure/clientRepository.js";
import ClientService from "../../../client/application/clientService.js";
import TenantDeactivationRepository from "../../infrastructure/tenantDeactivationRepository.js";
import AdminService from "../../../admin/application/adminService.js";
import SessionRepository from "../../../session/infrastructure/sessionRepository.js";
import SessionService from "../../../session/application/sessionService.js";
import LogsRepository from "../../../logs/infrastructure/logsRepository.js";
import LogsService from "../../../logs/application/logsService.js";
import ServerRequestRepository from "../../../logs/infrastructure/serverRequestRepository.js";
import ServerRequestService from "../../../logs/application/serverRequestService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import SocketService from "../../../../config/socket.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";

class TenantController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.roleRepository = new RoleRepository(this.prisma.role);
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.pipelineRepository = new PipelineRepository(this.prisma.pipeline);
        this.itemRepository = new ItemRepository(this.prisma.pipelineItem);
        this.choiceRepository = new ChoiceRepository(this.prisma.tenantAdminChoices);
        this.authRepository = new AuthRepository(this.prisma.auth);
        this.generateCode = new ReferralCodeGenerator(12);
        this.token = TokenService;
        this.tenantDeactivationRepository = new TenantDeactivationRepository(this.prisma.tenantDeactivation);
        this.service = new TenantService({
            templateRenderer: templateRenderer,
            tenantDeactivationRepository: this.tenantDeactivationRepository,
            tenantRepository: this.tenantRepository,
            prisma: this.prisma,
            roleRepository: this.roleRepository,
            staffRepository: this.staffRepository,
            pipelineRepository: this.pipelineRepository,
            itemRepository: this.itemRepository,
            generateCode: this.generateCode,
            choiceRepository: this.choiceRepository,
            authRepository: this.prisma.authenticator,
            tokenService: this.token
        });
        this.clientRepository = new ClientRepository(this.prisma.client);
        this.clientService = new ClientService({ clientRepository: this.clientRepository });
        this.adminService = new AdminService();
        this.sessionRepository = new SessionRepository(this.prisma);
        this.sessionService = new SessionService({ sessionRepository: this.sessionRepository });
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.logService = new LogsService({ logsRepository: this.logsRepository });
        this.serverRequestRepository = new ServerRequestRepository(this.prisma.serverRequest, this.prisma);
        this.serverRequestService = new ServerRequestService({ serverRequestRepository: this.serverRequestRepository });
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
    }

    createCandidate = expressAsyncHandler(async (req, res) => {
        const tenant = await this.service.createCandidate(req.body);

        if (!tenant) {
            return res.status(500).json({ message: 'Failed to create candidate.' });
        }

        const superAdmin = await this.adminService.getSuperAdmin();
        if (superAdmin?.email) {
            const html = templateRenderer.render('tenant-created-superadmin', {
                companyName: tenant.companyName || 'N/A',
                email: tenant.email || 'N/A',
                phoneNumber: tenant.phoneNumber || 'N/A',
                createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            });
            await MailService.sendMail(
                superAdmin.email,
                'New Tenant Created on NooSphere',
                `A new tenant ${tenant.companyName} has been created on NooSphere.`,
                html
            );
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

    updateAccountOfficer = expressAsyncHandler(async (req, res) => {
        const tenant = await this.service.updateTenant({
            id: req.params.tenantId,
            assignToAdmin: req.params.officerId,
        });

        if (!tenant) {
            res.status(500).json({ message: 'Failed to update tenant.' });
        }

        return res.status(201).json({
            message: "Candidate updated successfully",
            status: 'ok',
            data: tenant
        });
    });

    changeEmail = expressAsyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const tenant = await this.service.changeEmail({
            id: tenantId,
            email,
        });

        if (!tenant) {
            return res.status(500).json({ message: "Failed to update tenant email." });
        }

        return res.status(200).json({
            message: "Tenant email updated successfully",
            status: "ok",
            data: tenant,
        });
    });

    changePhoneNumber = expressAsyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const tenant = await this.service.changePhoneNumber({
            id: tenantId,
            phoneNumber,
        });

        if (!tenant) {
            return res.status(500).json({ message: "Failed to update tenant phone number." });
        }

        return res.status(200).json({
            message: "Tenant phone number updated successfully",
            status: "ok",
            data: tenant,
        });
    });

    changeAdminPassword = expressAsyncHandler(async (req, res) => {
        const { tenantId } = req.params;

        const tenant = await this.service.changeAdminPassword({
            id: tenantId,
        });

        if (!tenant) {
            return res.status(500).json({
                message: "Failed to reset tenant admin password.",
            });
        }

        return res.status(200).json({
            message: "Tenant admin password reset successfully",
            status: "ok",
        });
    });

    getTenantRelationsCount = expressAsyncHandler(async (req, res) => {
        const tenantRelationsCount = await this.service.getTenantRelationsCount(req.params.tenantId);

        if (!tenantRelationsCount) {
            return res.status(500).json({ message: 'Failed to fetch tenant relations count.' });
        }

        const tenantSessionCount = await this.sessionService.countTenantSessions(req.params.tenantId);

        const tenantSessionGraph = await this.sessionService.tenantOverviewGraph(req.params.tenantId, "month");

        if (!tenantSessionGraph) {
            return res.status(500).json({ message: 'Failed to fetch tenant session graph.' });
        }

        const getTenantServerRequestGraphLastYear = await this.serverRequestService.getTenantServerRequestGraphLastYear(req.params.tenantId);

        if (!getTenantServerRequestGraphLastYear) {
            return res.status(500).json({ message: 'Failed to fetch tenant server request.' });
        }

        return res.status(200).json({
            message: "Tenant relations and session counts fetched successfully",
            status: 'ok',
            data: {
                ...tenantRelationsCount,
                tenantSessionCount,
                tenantSessionGraph,
                getTenantServerRequestGraphLastYear
            }
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

    getDeactivationLogs = expressAsyncHandler(async (req, res) => {
        const logs = await this.service.getDeactivationLogs(req.query);

        if (!logs) {
            return res.status(500).json({ message: 'Failed to fetch deactivation logs.' });
        }

        return res.status(200).json({
            message: "Deactivation logs fetched successfully",
            status: 'ok',
            data: logs
        });
    });

    getActivationLogs = expressAsyncHandler(async (req, res) => {
        const logs = await this.service.getActivationLogs(req.query);

        if (!logs) {
            return res.status(500).json({ message: 'Failed to fetch activation logs.' });
        }

        return res.status(200).json({
            message: "Activation logs fetched successfully",
            status: 'ok',
            data: logs
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

    getAllActiveTenant = expressAsyncHandler(async (req, res) => {
        const tenants = await this.service.getAllActiveTenant();

        if (!tenants) {
            res.status(500).json({ message: 'Failed to fetch tenants.' });
        }

        return res.status(201).json({
            message: "Tenants fetched successfully",
            status: 'ok',
            data: tenants
        });
    });

    tenantManagementOverview = expressAsyncHandler(async (req, res) => {
        const totalTenants = await this.service.countPaidTenants();
        const totalStaffs = await this.service.countStaffsOfPaidTenants();
        const totalClients = await this.clientService.countClientsOfPaidTenants();

        if (totalTenants == null || totalStaffs == null || totalClients == null) {
            return res.status(500).json({ message: 'Failed to fetch tenants, staffs, or clients.' });
        }

        return res.status(201).json({
            message: "Tenants and staffs counted successfully",
            status: 'ok',
            data: {
                totalTenants,
                totalStaffs,
                totalClients
            }
        });
    });

    tenantActiveStatus = expressAsyncHandler(async (req, res) => {
        const authorize = await this.adminService.verifyPassword({
            id: req.body.deactivatedById,
            password: req.body.password
        });

        if (!authorize) {
            res.status(500).json({ message: 'Failed to authorize admin.' });
        }

        const tenant = await this.service.tenantActiveStatus(req.body);

        if (!tenant) {
            res.status(500).json({ message: 'Failed to deactivate tenant.' });
        }

        if (req.body.active === false) {
            const superAdmin = await this.adminService.getSuperAdmin();
            if (superAdmin?.email) {
                const html = templateRenderer.render('tenant-deactivated-superadmin', {
                    companyName: tenant.companyName || 'N/A',
                    reason: req.body.reason || 'No reason provided',
                    deactivatedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
                });
                await MailService.sendMail(
                    superAdmin.email,
                    `Tenant Deactivated: ${tenant.companyName}`,
                    `A tenant ${tenant.companyName} has been deactivated on NooSphere. Click here to view details.`,
                    html
                );
            }
        }

        return res.status(201).json({
            message: "Tenant deactivated successfully",
            status: 'ok',
            data: tenant
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

        const log = await this.logService.createLog({
            tenantId: staff.tenantId,
            action: `${staff.fullName} logged in`,
            reason: "User login",
            details: `Staff ${staff.fullName} logged in at ${new Date().toISOString()}`,
            feature: "login"
        });

        if (!log) {
            res.status(500).json({ message: 'Failed to log login' });
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
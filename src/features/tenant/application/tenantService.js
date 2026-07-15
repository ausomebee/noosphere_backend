import MailService from '../../../utilities/nodemailer.js';
import Tenant from '../domain/tenant.js';
import argon2 from "argon2";
import { seedTenantBillingDefaults } from './tenantOnboardingSeed.js';

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

class TenantService {
    constructor({ tenantDeactivationRepository, tenantRepository, prisma, tokenService, roleRepository, staffRepository, pipelineRepository, itemRepository, generateCode, choiceRepository, authRepository, templateRenderer }) {
        this.tenantDeactivationRepository = tenantDeactivationRepository;
        this.tenantRepository = tenantRepository;
        this.prisma = prisma;
        this.roleRepository = roleRepository;
        this.staffRepository = staffRepository;
        this.pipelineRepository = pipelineRepository;
        this.itemRepository = itemRepository;
        this.generateCode = generateCode;
        this.choiceRepository = choiceRepository;
        this.authRepository = authRepository;
        this.templateRenderer = templateRenderer;
        this.token = tokenService;
    }

    async createCandidate(data) {
        const tenantExists = await this.tenantRepository.findFirstDynamic({
            where: {
                isDeleted: false,
                OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }, { subdomain: data.subdomain }],
            },
            select: {
                email: true,
                phoneNumber: true
            }
        });
        if (tenantExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (tenantExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const createData = new Tenant(data);

        const newCandidate = await this.prisma.$transaction(async (tx) => {
            const tenant = await this.tenantRepository.txCreate(createData.createTenant, tx);
            return await seedTenantBillingDefaults({
                tenantId: tenant.id,
                tx,
                pipelineStageId: data.pipelineStageId,
                assignToAdmin: data.assignToAdmin,
                staffData: createData.createTenantStaff,
            });
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        return {...newCandidate.pipelineItem, companyName: data.companyName};
    }

    async sendTenantWelcomeEmail(tenant) {
        const tenantStaff = await this.staffRepository.staffExistsWithRole(tenant.email);

        if (!tenantStaff) {
            throw new Error("Tenant staff not found.");
        }

        if (tenantStaff.password) {
            return tenantStaff;
        }

        const generatedPass = this.generateCode.generateStrongPassword();
        const hashedPass = await argon2.hash(generatedPass);
        const updatedStaff = await this.staffRepository.update(tenantStaff.id, {
            password: hashedPass,
        });

        if (!updatedStaff) {
            throw new Error("Failed to set tenant password.");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "image/png",
            }
        ];

        const html = await this.templateRenderer.render('tenant-welcome.html', {
            companyName: tenant.companyName,
            email: tenant.email,
            password: generatedPass,
            clientUrl: this.templateRenderer.buildTenantClientUrl(tenant.subdomain),
            subdomain: tenant.subdomain
        });

        const sendMail = await MailService.sendMail(
            tenant.email,
            "Welcome to Noosphere",
            null,
            html,
            attachments
        );

        if (!sendMail.success) {
            throw new Error("Failed to send tenant welcome mail");
        }

        return updatedStaff;
    }

    async checkDomain(domain) {
        const tenant = await this.tenantRepository.findOne({ subdomain: domain });

        if (tenant) {
            throw new Error("Domain already exists")
        }

        return "valid domain";
    }

    async updateTenant(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id })

        if (!tenant) {
            throw new Error("tenant not found");
        }

        if (data.subdomain && data.subdomain !== tenant.subdomain) {
            const tenantExists = await this.tenantRepository.findFirstDynamic({
                where: {
                    subdomain: data.subdomain,
                    id: { not: data.id },
                },
                select: {
                    subdomain: true,
                },
            });

            if (tenantExists) {
                throw new Error("Domain already exists");
            }
        }

        const update = await this.prisma.$transaction(async (tx) => {
            const updatedTenant = await tx.tenant.update({
                where: { id: data.id },
                data: {
                    email: data.email || tenant.email,
                    phoneNumber: data.phoneNumber || tenant.phoneNumber,
                    active: data.active ?? tenant.active,
                    isDeleted: data.isDeleted ?? tenant.isDeleted,
                    companyName: data.companyName || tenant.companyName,
                    contactPerson: data.contactPerson || tenant.contactPerson,
                    companySize: data.companySize || tenant.companySize,
                    organizationType: data.organizationType || tenant.organizationType,
                    location: data.location || tenant.location,
                    subdomain: data.subdomain || tenant.subdomain,
                    leadSource: data.leadSource || tenant.leadSource,
                    stage: data.stage || tenant.stage,
                    website: data.website || tenant.website,
                    practiceNPI: data.practiceNPI || tenant.practiceNPI,
                    assignToAdmin: data.assignToAdmin || tenant.assignToAdmin,
                }
            });

            if (data.isDeleted === true && tenant.isDeleted !== true) {
                await tx.tenantStaff.updateMany({
                    where: { tenantId: data.id },
                    data: {
                        isDeleted: true,
                        active: false,
                    },
                });
            }

            return updatedTenant;
        });

        if (!update) {
            throw new Error("Failed to update tenant");
        }

        return update;
    }

    async changeEmail(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id })

        if (!tenant) {
            throw new Error("tenant not found");
        }

        const tenantExists = await this.tenantRepository.findFirstDynamic({
            where: {
                email: data.email
            },
            select: {
                email: true,
            }
        });

        if (tenantExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        const update = await this.tenantRepository.update(data.id, {
            email: data.email || tenant.email,
        });

        if (!update) {
            throw new Error("Failed to update tenant email");
        }

        return update;
    }

    async changePhoneNumber(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id })

        if (!tenant) {
            throw new Error("tenant not found");
        }

        const tenantExists = await this.tenantRepository.findFirstDynamic({
            where: {
                phoneNumber: data.phoneNumber,
                isDeleted: false,
            },
            select: {
                phoneNumber: true,
            }
        });

        if (tenantExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const update = await this.tenantRepository.update(data.id, {
            phoneNumber: data.phoneNumber || tenant.phoneNumber,
        });

        if (!update) {
            throw new Error("Failed to update tenant phone number");
        }

        return update;
    }

    async changeAdminPassword(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id })

        if (!tenant) {
            throw new Error("tenant not found");
        }

        const tenantStaff = await this.staffRepository.staffExistsWithRole(tenant.email);

        if (!tenantStaff) {
            throw new Error("Staff not found.");
        }

        const generatedPass = this.generateCode.generateStrongPassword()
        const hashedPass = await argon2.hash(generatedPass)

        const updated = await this.staffRepository.update(tenantStaff.id, {
            password: hashedPass,
        });

        if (!updated) {
            throw new Error("Failed to update tenant staff password");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "image/png",
            }
        ]

        const html = await this.templateRenderer.render('tenant-password-change.html', {
            companyName: tenant.companyName,
            email: tenant.email,
            password: generatedPass
        });

        const sendMail = await MailService.sendMail(tenant.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return updated;
    }

    async getTenantRelationsCount(tenantId) {
        const tenantRelationsCount = await this.tenantRepository.getTenantRelationsCount(tenantId);

        return tenantRelationsCount;
    }

    async tenantActiveStatus(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id });

        if (!tenant) {
            throw new Error("Tenant not found");
        }

        const updatedTenant = await this.tenantRepository.update(data.id, {
            active: data.active ?? tenant.active,
        });

        if (!updatedTenant) {
            throw new Error("Failed to update tenant");
        }

        if (data.active === false) {
            await this.tenantDeactivationRepository.create({
                tenantId: data.id,
                deactivatedById: data.deactivatedById,
                reason: data.reason,
                details: data.details
            });
        }

        if (data.active === true) {
            const lastDeactivation =
                await this.tenantDeactivationRepository.findLatestByTenantId(data.id);

            if (lastDeactivation && !lastDeactivation.reactivationDate) {
                await this.tenantDeactivationRepository.update(lastDeactivation.id, {
                    reactivationDate: new Date()
                });
            }
        }

        return updatedTenant;
    }

    async getDeactivationLogs(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        const logs = await this.tenantDeactivationRepository.getDeactivationLogs(page, limit);

        return logs;
    }

    async getActivationLogs(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        const logs = await this.tenantDeactivationRepository.getReactivationLogs(page, limit);

        return logs;
    }

    async getAllTenant() {
        const tenants = await this.tenantRepository.findAllAndPopulate({});

        if (!tenants) {
            throw new Error("Tenants not found")
        }

        return tenants;
    }

    async getAllActiveTenant() {
        const tenants = await this.tenantRepository.findAllWithActiveSubscription();

        if (!tenants) {
            throw new Error("Tenants not found")
        }

        return tenants;
    }

    async getTenant(id) {
        const tenants = await this.tenantRepository.findOneAndPopulate({ id });

        if (!tenants) {
            throw new Error("Tenant not found")
        }

        return tenants;
    }

    async availaibleStaffs(tenantId) {
        const totalStaff = await this.staffRepository.totalStaff(tenantId);
        if (!totalStaff) {
            throw new Error("staffs not found")
        }

        const availableStaff = await this.staffRepository.availableStaff(tenantId);

        return { totalStaff, availableStaff };
    }

    async averageClinicians(tenantId) {
        const clinicians = await this.staffRepository.cliniciansPerClient(tenantId);
        if (!clinicians) {
            throw new Error("clinicians not found")
        }

        const totalClients = clinicians.reduce(
            (sum, c) => sum + c._count.ClientTenant,
            0
        );

        const average = clinicians.length > 0 ? totalClients / clinicians.length : 0;

        return { average };
    }

    async countAllTenant() {
        const totalTenants = await this.tenantRepository.countAllTenants();

        if (!totalTenants) {
            throw new Error("Tenants not found")
        }

        return totalTenants;
    }

    async countPaidTenants() {
        return await this.tenantRepository.countPaidTenants();
    }

    async countAllStaffs() {
        const totalStaffs = await this.staffRepository.countAllStaffs();

        if (!totalStaffs) {
            throw new Error("Staffs not found")
        }

        return totalStaffs;
    }

    async countStaffsOfPaidTenants() {
        return await this.staffRepository.countStaffsOfPaidTenants();
    }

    async contactTenantByEmail(data) {
        const tenant = await this.tenantRepository.findFirst({ id: data.id });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "image/png",
            },
            ...(data.attachments ? [{
                filename: data.attachments.originalname,
                content: data.attachments.buffer,
                contentType: data.attachments.mimetype,
            }] : [])
        ];

        const html = await this.templateRenderer.render('contact-tenant.html', {
            tenantName: escapeHtml(tenant.contactPerson || tenant.companyName),
            heading: escapeHtml(data.header),
            message: escapeHtml(data.body).replace(/\r?\n/g, '<br>')
        });

        const sendMail = await MailService.sendMail(tenant.email, data.header, data.body, html, attachments)
        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return true;
    }

    async createTenantStaff(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.tenantId });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }

        const tenantStaff = await this.staffRepository.findFirst({
            email: data.email,
            tenantId: data.tenantId
        });

        if (tenantStaff) {
            throw new Error("Staff already exists.");
        }

        const createData = new Tenant(data);

        const newStaff = await this.staffRepository.create(createData.createTenantStaff);

        if (!newStaff) {
            throw new Error("Failed to create staff");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "image/png",
            }
        ]

        const html = await this.templateRenderer.render('tenant-welcome-staff.html', {
            companyName: tenant.companyName,
            email: newStaff.email,
            staffId: newStaff.id,
            clientUrl: this.templateRenderer.buildTenantClientUrl(tenant.subdomain),
            subdomain: tenant.subdomain
        });

        const sendMail = await MailService.sendMail(newStaff.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error(`Failed to send staff welcome email: ${sendMail.error}`);
        }

        return newStaff;
    }

    async tenantStaffLogin(data) {
        const tenantStaff = await this.staffRepository.staffExistsWithRole(data.email);

        if (!tenantStaff) {
            throw new Error("Staff not found.");
        }

        const tenant = await this.tenantRepository.findOne({ id: tenantStaff.tenantId });

        if (!tenant?.active || tenant.isDeleted) {
            throw new Error("Not Authorized: Tenant account is not active.");
        }

        if (!tenantStaff.password) {
            throw new Error("create your password.");
        }

        const isPasswordValid = await argon2.verify(tenantStaff.password, data.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password.");
        }

        const claims = {
            id: tenantStaff.id,
            role: tenantStaff.role.name,
            permissions: tenantStaff.role.access
        }

        const { password: _sp, ...staffData } = tenantStaff;
        return { ...staffData, accessToken: this.token.generateAccessToken(claims), refreshToken: this.token.generateRefreshToken(tenantStaff.id, "STAFF") };
    }

    async tenantAdminChoices(data) {
        const choiceExists = await this.choiceRepository.findFirst({ tenantId: data.tenantId });

        if (choiceExists) {
            if (this.shouldResetTenantStaffChoices(choiceExists, data)) {
                await this.resetTenantStaffChoices(data);
            }

            const update = await this.choiceRepository.update(choiceExists.id, {
                Authenticator2FA: data.Authenticator2FA,
                securityQuestion: data.securityQuestion,
                setForAll: data.setForAll,
                isEnabled: data.isEnabled ?? choiceExists.isEnabled
            });

            if (!update) {
                throw new Error("Failed to update choice");
            }

            return update;
        }

        const newChoice = await this.choiceRepository.create(data);

        if (!newChoice) {
            throw new Error("Failed to create choice");
        }

        return newChoice;
    }

    shouldResetTenantStaffChoices(currentChoices, nextChoices) {
        return nextChoices.setForAll && (
            currentChoices.Authenticator2FA !== nextChoices.Authenticator2FA ||
            currentChoices.securityQuestion !== nextChoices.securityQuestion
        );
    }

    async resetTenantStaffChoices(data) {
        const staffs = await this.staffRepository.findAll({ tenantId: data.tenantId });
        const reset = await this.staffRepository.updateAll(data.tenantId, {
            authType: data.Authenticator2FA ? "AUTHENTICATOR" : "SECRETMESSAGE",
            authQuestion: null,
            auth2FADone: false
        });

        if (!reset) {
            throw new Error("Failed to reset all tenant staff choices");
        }

        const staffIds = staffs.map((staff) => staff.id);
        if (staffIds.length > 0) {
            const deleted = await this.authRepository.deleteMany({
                module: "TENANT",
                userId: { in: staffIds }
            });

            if (!deleted) {
                throw new Error("Failed to delete tenant staff auth");
            }
        }
    }

    async getChoices(tenantId) {
        const choice = await this.choiceRepository.findFirst({ tenantId });

        if (!choice) {
            throw new Error("choice not found")
        }

        return choice;
    }

    async getStaffByPaymentSchedule(tenantId, paymentSchedule) {
        return await this.staffRepository.getStaffByPaymentSchedule(tenantId, paymentSchedule);
    }

    async getStaffPayrollSummary(tenantId) {
        const staffs = await this.staffRepository.findStaffWithPayrollByTenant(tenantId);

        return staffs.map(staff => {
            const payroll = staff.TenantStaffPayroll[0]; // assuming one payroll per staff

            if (!payroll) {
                return {
                    staffName: staff.fullName,
                    grossPay: 0,
                    netPay: 0,
                    paymentSchedule: null
                };
            }

            const ratePerHour = Number(payroll.ratePerHour || 0);

            let grossPay = 0;

            payroll.incomeItems.forEach(item => {
                const rate = item.rate || {};

                if (item.type === "Flat Rate") {
                    grossPay += Number(rate.rate || 0);
                }

                else if (item.type === "Percentage based") {
                    grossPay += ratePerHour * (Number(rate.unit || 0) / 100);
                }

                else if (item.type === "Time based") {
                    const hours = Number(rate.unitMinutes || 0) / 60;
                    grossPay += ratePerHour * hours * Number(rate.unit || 1);
                }
            });

            let totalDeductions = 0;

            payroll.deductions.forEach(ded => {
                const rate = ded.rate || {};

                if (ded.type === "Flat Rate") {
                    totalDeductions += Number(rate.rate || 0);
                }

                else if (ded.type === "Percentage based") {
                    totalDeductions += grossPay * (Number(rate.unit || 0) / 100);
                }
            });

            const netPay = Math.max(0, grossPay - totalDeductions);

            return {
                staffName: staff.fullName,
                grossPay,
                netPay,
                paymentSchedule: payroll.paymentSchedule
            };
        });
    }

    async getStaffsWithTeamAccess(tenantId) {
        const staffs = await this.staffRepository.getStaffsWithTeamAccess(tenantId);
        return staffs ?? [];
    }

    async forgotPassword(email) {
        const staffExists = await this.staffRepository.staffExistsWithRole(email);

        if (!staffExists) {
            throw new Error("staff not found.");
        }

        if (!staffExists.auth2FADone && staffExists.role.name === "ADMIN") {
            throw new Error("2FA required.");
        }

        const setAll = await this.choiceRepository.findFirst({});

        if (!staffExists.auth2FADone && setAll.setForAll) {
            throw new Error("2FA required.");
        }

        const attachments = [
            {
                filename: "logo.png",
                path: "logo.png",
                cid: "unique@image",
                contentType: "logo/png",
            },
            {
                filename: "mailHeader.png",
                path: "mailHeader.png",
                cid: "unique2@image",
                contentType: "mailHeader/png",
            },
        ]

        const html = await this.templateRenderer.render('tenant-password-reset.html', {
            staffId: staffExists.id
        });

        const sendMail = await MailService.sendMail(staffExists.email, "Reset your password", null, html, attachments)
        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return true;
    }

    async updateStaff(data) {
        const staff = await this.staffRepository.findOne({ id: data.id })

        if (!staff) {
            throw new Error("staff not found");
        }

        if (data.currentPassword && !(await argon2.verify(staff.password, data.currentPassword))) {
            throw new Error('Incorrect password')
        }

        const hashedPass = data.password ? await argon2.hash(data.password) : staff.password;

        const update = await this.staffRepository.update(data.id, {
            fullName: data.fullName || staff.fullName,
            email: data.email || staff.email,
            stage: data.stage || staff.stage,
            phoneNumber: data.phoneNumber || staff.phoneNumber,
            roleId: data.roleId || staff.roleId,
            password: hashedPass,
            authType: data.authType || staff.authType,
            authQuestion: data.authQuestion || staff.authQuestion,
            auth2FADone: data.auth2FADone ?? staff.auth2FADone,
            active: data.active ?? staff.active,
            isDeleted: data.isDeleted ?? staff.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update admin");
        }

        return update;
    }

    async getAllTenantStaffs(tenantId) {
        const staffs = await this.staffRepository.findAll({ tenantId });

        if (!staffs) {
            throw new Error("staffs not found")
        }

        return staffs;
    }

    async updateStaffPassword(data) {
        const existingStaff = await this.staffRepository.findOne({ id: data.staffId });

        if (!existingStaff.active) {
            throw new Error("This staff does not exist.");
        }

        if (!(await argon2.verify(existingStaff.password, data.currentPassword))) {
            throw new Error('Incorrect password')
        }

        const hashedPass = await argon2.hash(data.newPassword)
        const updated = await this.staffRepository.update(data.staffId, {
            password: hashedPass,
        });

        if (!updated) {
            throw new Error("Failed to update password");
        }

        return updated;
    }

    async updateTenantAdminChoices(data) {
        const tenantAdminChoices = await this.choiceRepository.findOne({
            tenantId: data.tenantId
        });

        if (!tenantAdminChoices) {
            const created = await this.choiceRepository.create({
                tenantId: data.tenantId,
                Authenticator2FA: data.Authenticator2FA ?? false,
                securityQuestion: data.securityQuestion ?? null,
                setForAll: data.setForAll ?? false,
                isEnabled: data.isEnabled ?? true,
            });

            if (!created) {
                throw new Error("Failed to create tenant admin choices");
            }

            return created;
        }

        if (this.shouldResetTenantStaffChoices(tenantAdminChoices, data)) {
            await this.resetTenantStaffChoices(data);
        }

        const update = await this.choiceRepository.update(
            tenantAdminChoices.id,
            {
                Authenticator2FA: data.Authenticator2FA ?? tenantAdminChoices.Authenticator2FA,
                securityQuestion: data.securityQuestion ?? tenantAdminChoices.securityQuestion,
                setForAll: data.setForAll ?? tenantAdminChoices.setForAll,
                isEnabled: data.isEnabled ?? tenantAdminChoices.isEnabled,
            }
        );

        if (!update) {
            throw new Error("Failed to update tenant admin choices");
        }

        return update;
    }

    async updateTenantAdminChoicesEnabled(data) {
        const tenantAdminChoices = await this.choiceRepository.findOne({
            tenantId: data.tenantId
        });

        if (!tenantAdminChoices) {
            throw new Error("Tenant admin choices not found");
        }

        const updatedChoice = await this.choiceRepository.update(
            tenantAdminChoices.id,
            { isEnabled: data.isEnabled }
        );

        if (!updatedChoice) {
            throw new Error("Failed to update tenant admin choices enabled status");
        }

        return updatedChoice;
    }

    async getStaffPayrollSummary(tenantId) {
        const staffs = await this.staffRepository.findStaffWithPayrollByTenant(tenantId);

        return staffs.map(staff => {
            const payroll = staff.TenantStaffPayroll[0]; // assuming one payroll per staff

            if (!payroll) {
                return {
                    staffName: staff.fullName,
                    grossPay: 0,
                    netPay: 0,
                    paymentSchedule: null
                };
            }

            const ratePerHour = Number(payroll.ratePerHour || 0);

            let grossPay = 0;

            payroll.incomeItems.forEach(item => {
                const rate = item.rate || {};

                if (item.type === "Flat Rate") {
                    grossPay += Number(rate.rate || 0);
                }

                else if (item.type === "Percentage based") {
                    grossPay += ratePerHour * (Number(rate.unit || 0) / 100);
                }

                else if (item.type === "Time based") {
                    const hours = Number(rate.unitMinutes || 0) / 60;
                    grossPay += ratePerHour * hours * Number(rate.unit || 1);
                }
            });

            let totalDeductions = 0;

            payroll.deductions.forEach(ded => {
                const rate = ded.rate || {};

                if (ded.type === "Flat Rate") {
                    totalDeductions += Number(rate.rate || 0);
                }

                else if (ded.type === "Percentage based") {
                    totalDeductions += grossPay * (Number(rate.unit || 0) / 100);
                }
            });

            const netPay = Math.max(0, grossPay - totalDeductions);

            return {
                staffName: staff.fullName,
                grossPay,
                netPay,
                paymentSchedule: payroll.paymentSchedule,
                id: staff.id
            };
        });
    }

    async findStaffWithPayrollByTenantAndDateRange(tenantId, startDate, endDate, paymentSchedule) {
        const staffs = await this.staffRepository.findStaffWithPayrollByTenantAndDateRange(tenantId, startDate, endDate, paymentSchedule);

        return staffs.map(staff => {
            const payroll = staff.TenantStaffPayroll[0]; // assuming one payroll per staff

            if (!payroll) {
                return {
                    staffName: staff.fullName,
                    grossPay: 0,
                    netPay: 0,
                    paymentSchedule: null,
                    staff: staff
                };
            }

            const ratePerHour = Number(payroll.ratePerHour || 0);

            let grossPay = 0;

            payroll.incomeItems.forEach(item => {
                const rate = item.rate || {};

                if (item.type === "Flat Rate") {
                    grossPay += Number(rate.rate || 0);
                }

                else if (item.type === "Percentage based") {
                    grossPay += ratePerHour * (Number(rate.unit || 0) / 100);
                }

                else if (item.type === "Time based") {
                    const hours = Number(rate.unitMinutes || 0) / 60;
                    grossPay += ratePerHour * hours * Number(rate.unit || 1);
                }
            });

            let totalDeductions = 0;

            payroll.deductions.forEach(ded => {
                const rate = ded.rate || {};

                if (ded.type === "Flat Rate") {
                    totalDeductions += Number(rate.rate || 0);
                }

                else if (ded.type === "Percentage based") {
                    totalDeductions += grossPay * (Number(rate.unit || 0) / 100);
                }
            });

            const netPay = Math.max(0, grossPay - totalDeductions);

            return {
                staffName: staff.fullName,
                grossPay,
                netPay,
                paymentSchedule: payroll.paymentSchedule,
                staff: staff
            };
        });
    }
}

export default TenantService;

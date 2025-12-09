import MailService from '../../../utilities/nodemailer.js';
import Tenant from '../domain/tenant.js';
import argon2 from "argon2";

class TenantService {
    constructor({ tenantRepository, prisma, tokenService, departmentRepository, roleRepository, staffRepository, pipelineRepository, itemRepository, generateCode, choiceRepository, authRepository }) {
        this.tenantRepository = tenantRepository;
        this.prisma = prisma;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.staffRepository = staffRepository;
        this.pipelineRepository = pipelineRepository;
        this.itemRepository = itemRepository;
        this.generateCode = generateCode;
        this.choiceRepository = choiceRepository;
        this.authRepository = authRepository;
        this.token = tokenService;
    }

    async createCandidate(data) {
        const tenantExists = await this.tenantRepository.findFirstDynamic({
            where: {
                OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
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

        const generatedPass = this.generateCode.generateStrongPassword()
        const hashedPass = await argon2.hash(generatedPass)
        const createData = new Tenant({ ...data, password: hashedPass });

        const newCandidate = await this.prisma.$transaction(async (tx) => {
            const tenant = await this.tenantRepository.txCreate(createData.createTenant, tx);
            const pipeline = await this.pipelineRepository.txCreate({
                module: "CLIENT",
                name: "Pipeline",
                description: "Manage your client intake process seamlessly",
                createdByTenantId: tenant.id
            }, tx);
            const pipelineItem = await this.itemRepository.txCreate({
                tenantId: tenant.id,
                pipelineStageId: data.pipelineStageId,
                assignToAdmin: data.assignToAdmin
            }, tx)
            const department = await this.departmentRepository.createTenantDepartment(tenant.id, tx);
            const role = await this.roleRepository.createTenantRole(department.id, tx);
            const staff = await this.staffRepository.txCreate({ ...createData.createTenantStaff, tenantId: tenant.id, roleId: role.id }, tx);

            return { pipelineItem, staff };
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "Logowrap/png",
            }
        ]

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Noosphere!</title>
                <style>
                    /* Reset styles for email clients */
                    body, table, td, p, a {
                        margin: 0;
                        padding: 0;
                        border: 0;
                        font-size: 100%;
                        font: inherit;
                        vertical-align: baseline;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .email-content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    
                    .logo-container {
                        margin-bottom: 30px;
                    }
                    
                    .logo {
                        display: inline-flex;
                        align-items: center;
                        font-size: 40px;
                        font-weight: 600;
                        color: #000000;
                        text-decoration: none;
                    }
                    
                    
                    .welcome-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #004ABA;
                        margin-bottom: 25px;
                    }
                    
                    .welcome-text {
                        font-size: 16px;
                        color: #475467;
                        margin-bottom: 8px;
                        line-height: 1.5;
                    }
                    
                    .company-name {
                        color: #004ABA;
                        font-weight: 600;
                    }
                    
                    .instruction-text {
                        font-size: 16px;
                        color: #475467;
                        margin: 25px 0 30px 0;
                    }
                    
                    .credentials-container {

                        padding: 25px;
                        margin: 25px 0;
                    }
                    
                    .credential-row {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    
                    .credential-row:last-child {
                        margin-bottom: 0;
                    }
                    
                    .credential-label {
                        font-weight: 600;
                        color: #333333;
                        font-size: 16px;
                        min-width: 90px;
                    }
                    
                    .credential-value {
                        color: #666666;
                        font-size: 16px;
                        flex: 1;
                        text-align: right;
                    }
                    
                    .login-button {
                        display: inline-block;
                        background-color: #004ABA;
                        color: white;
                        text-decoration: none;
                        padding: 14px 32px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        margin: 25px 0;
                        transition: background-color 0.3s ease;
                    }
                    
                    .login-button:hover {
                        background-color: #1565C0;
                    }
                    
                    .info-box {
                        background-color: #E3F2FD;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 25px 0;
                        border: 1px solid #99C2FF;
                    }
                    
                    .info-title {
                        font-size: 16px;
                        color: #666666;
                        margin-bottom: 15px;
                    }
                    
                    .info-list {
                        text-align: left;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .info-item {
                        color: #666666;
                        font-size: 16px;
                        margin-bottom: 8px;
                        padding-left: 0;
                        list-style: none;
                        position: relative;
                    }
                    
                    .info-item::before {
                        content: counter(item-counter) ". ";
                        counter-increment: item-counter;
                        font-weight: 600;
                    }
                    
                    .info-list {
                        counter-reset: item-counter;
                    }
                    
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                    
                    }
                    
                    .footer-text {
                        color: #1976D2;
                        font-size: 16px;
                        margin-bottom: 5px;
                    }
                    
                    .team-signature {
                        color: #1976D2;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    
                    /* Mobile responsive */
                    @media only screen and (max-width: 600px) {
                        .email-container {
                            margin: 0;
                            border-radius: 0;
                        }
                        
                        .email-content {
                            padding: 30px 20px;
                        }
                        
                        .credentials-container {
                            padding: 20px 15px;
                        }
                        
                        .credential-row {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 5px;
                        }
                        
                        .credential-value {
                            text-align: left;
                        }
                        
                        .welcome-title {
                            font-size: 22px;
                        }
                        
                        .logo {
                            font-size: 24px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-content">
                        <!-- Logo -->
                        <div class="logo-container">
                            <div class="logo">
                            <img src="cid:unique@image" alt="" srcset="">
                            </div>
                        </div>
                        
                        <!-- Welcome Title -->
                        <h1 class="welcome-title">Welcome to Noosphere!</h1>
                        
                        <!-- Welcome Text -->
                        <p class="welcome-text">
                            Your company account <span class="company-name">${data.companyName}</span> has been created on<br>
                            Noosphere, and you've been designated as the administrator.
                        </p>
                        
                        <!-- Instruction Text -->
                        <p class="instruction-text">
                            Use the credentials below to log in and complete your setup:
                        </p>
                        
                        <!-- Credentials -->
                        <div class="credentials-container">
                            <div class="credential-row">
                                <span class="credential-label">Email: ${data.email}</span>
                            </div>
                            <div class="credential-row">
                                <span class="credential-label">Password: ${generatedPass}</span>
                            </div>
                        </div>
                        
                        <!-- Login Button -->
                        <a href="http://localhost:5173/auth/initial-login" class="login-button">Login to my account</a>
                        
                        <!-- Info Box -->
                        <div class="info-box">
                            <p class="info-title">Once you're in, you'll be prompted to:</p>
                            <ol class="info-list">
                                <li class="info-item">Set a new password.</li>
                                <li class="info-item">Configure 2-factor authentication for your and your organization.</li>
                            </ol>
                        </div>
                        
                        <!-- Footer -->
                        <div class="footer">
                            <p class="footer-text">Welcome aboard,</p>
                            <p class="team-signature">The NoSphere Team</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `

        const sendMail = await MailService.sendMail(data.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return newCandidate.pipelineItem;
    }

    async updateTenant(data) {
        const tenant = await this.tenantRepository.findOne({ id: data.id })

        if (!tenant) {
            throw new Error("tenant not found");
        }

        const update = await this.tenantRepository.update(data.id, {
            email: data.email || tenant.email,
            phoneNumber: data.phoneNumber || tenant.phoneNumber,
            active: data.active ?? tenant.active,
            isDeleted: data.isDeleted ?? tenant.isDeleted,
            companyName: data.companyName || tenant.companyName,
            contactPerson: data.contactPerson || tenant.contactPerson,
            companySize: data.companySize || tenant.companySize,
            organizationType: data.organizationType || tenant.organizationType,
            location: data.location || tenant.location,
            leadSource: data.leadSource || tenant.leadSource,
            stage: data.stage || tenant.stage,
            website: data.website || tenant.website,
            practiceNPI: data.practiceNPI || tenant.practiceNPI
        });

        if (!update) {
            throw new Error("Failed to update tenant");
        }

        return update;
    }

    async getAllTenant() {
        const tenants = await this.tenantRepository.findAllAndPopulate({});

        if (!tenants) {
            throw new Error("Tenants not found")
        }

        return tenants;
    }

    async getTenant(id) {
        const tenants = await this.tenantRepository.findFirst({ id });

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

    async contactTenantByEmail(data) {
        const tenant = await this.tenantRepository.findFirst({ id: data.id });

        if (!tenant) {
            throw new Error("Tenant not found.");
        }

        const attachments = data.attachments
            ? [{
                filename: data.attachments.originalname,
                content: data.attachments.buffer,
                contentType: data.attachments.mimetype,
            }]
            : []

        const sendMail = MailService.sendMail(tenant.email, data.header, data.body, null, attachments)
        if (!sendMail) {
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
                contentType: "Logowrap/png",
            }
        ]

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Noosphere!</title>
                <style>
                    /* Reset styles for email clients */
                    body, table, td, p, a {
                        margin: 0;
                        padding: 0;
                        border: 0;
                        font-size: 100%;
                        font: inherit;
                        vertical-align: baseline;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .email-content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    
                    .logo-container {
                        margin-bottom: 30px;
                    }
                    
                    .logo {
                        display: inline-flex;
                        align-items: center;
                        font-size: 40px;
                        font-weight: 600;
                        color: #000000;
                        text-decoration: none;
                    }
                    
                    
                    .welcome-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #004ABA;
                        margin-bottom: 25px;
                    }
                    
                    .welcome-text {
                        font-size: 16px;
                        color: #475467;
                        margin-bottom: 8px;
                        line-height: 1.5;
                    }
                    
                    .company-name {
                        color: #004ABA;
                        font-weight: 600;
                    }
                    
                    .instruction-text {
                        font-size: 16px;
                        color: #475467;
                        margin: 25px 0 30px 0;
                    }
                    
                    .credentials-container {

                        padding: 25px;
                        margin: 25px 0;
                    }
                    
                    .credential-row {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 12px;
                        text-align: left;
                    }
                    
                    .credential-row:last-child {
                        margin-bottom: 0;
                    }
                    
                    .credential-label {
                        font-weight: 600;
                        color: #333333;
                        font-size: 16px;
                        min-width: 90px;
                    }
                    
                    .credential-value {
                        color: #666666;
                        font-size: 16px;
                        flex: 1;
                        text-align: right;
                    }
                    
                    .login-button {
                        display: inline-block;
                        background-color: #004ABA;
                        color: white;
                        text-decoration: none;
                        padding: 14px 32px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        margin: 25px 0;
                        transition: background-color 0.3s ease;
                    }
                    
                    .login-button:hover {
                        background-color: #1565C0;
                    }
                    
                    .info-box {
                        background-color: #E3F2FD;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 25px 0;
                        border: 1px solid #99C2FF;
                    }
                    
                    .info-title {
                        font-size: 16px;
                        color: #666666;
                        margin-bottom: 15px;
                    }
                    
                    .info-list {
                        text-align: left;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .info-item {
                        color: #666666;
                        font-size: 16px;
                        margin-bottom: 8px;
                        padding-left: 0;
                        list-style: none;
                        position: relative;
                    }
                    
                    .info-item::before {
                        content: counter(item-counter) ". ";
                        counter-increment: item-counter;
                        font-weight: 600;
                    }
                    
                    .info-list {
                        counter-reset: item-counter;
                    }
                    
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                    
                    }
                    
                    .footer-text {
                        color: #1976D2;
                        font-size: 16px;
                        margin-bottom: 5px;
                    }
                    
                    .team-signature {
                        color: #1976D2;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    
                    /* Mobile responsive */
                    @media only screen and (max-width: 600px) {
                        .email-container {
                            margin: 0;
                            border-radius: 0;
                        }
                        
                        .email-content {
                            padding: 30px 20px;
                        }
                        
                        .credentials-container {
                            padding: 20px 15px;
                        }
                        
                        .credential-row {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 5px;
                        }
                        
                        .credential-value {
                            text-align: left;
                        }
                        
                        .welcome-title {
                            font-size: 22px;
                        }
                        
                        .logo {
                            font-size: 24px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-content">
                        <!-- Logo -->
                        <div class="logo-container">
                            <div class="logo">
                            <img src="cid:unique@image" alt="" srcset="">
                            </div>
                        </div>
                        
                        <!-- Welcome Title -->
                        <h1 class="welcome-title">Welcome to Noosphere!</h1>
                        
                        <!-- Welcome Text -->
                        <p class="welcome-text">
                            Your company account <span class="company-name">${tenant.companyName}</span> has been created on<br>
                            Noosphere, and you've been designated as the administrator.
                        </p>
                        
                        <!-- Instruction Text -->
                        <p class="instruction-text">
                            Use the credentials below to log in and complete your setup:
                        </p>
                        
                        <!-- Credentials -->
                        <div class="credentials-container">
                            <div class="credential-row">
                                <span class="credential-label">Email: ${newStaff.email}</span>
                            
                            </div>
                            
                        </div>
                        
                        <!-- Login Button -->
                        <a href="http://localhost:5173/auth/staff/onboarding/${newStaff.email}/${newStaff.id}" class="login-button">Login to my account</a>
                        
                        <!-- Info Box -->
                        <div class="info-box">
                            <p class="info-title">Once you're in, you'll be prompted to:</p>
                            <ol class="info-list">
                                <li class="info-item">Set a new password.</li>
                                <li class="info-item">Configure 2-factor authentication for your and your organization.</li>
                            </ol>
                        </div>
                        
                        <!-- Footer -->
                        <div class="footer">
                            <p class="footer-text">Welcome aboard,</p>
                            <p class="team-signature">The NoSphere Team</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `

        const sendMail = await MailService.sendMail(data.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return newStaff;
    }

    async tenantStaffLogin(data) {
        const tenantStaff = await this.staffRepository.staffExistsWithRole(data.email);

        if (!tenantStaff) {
            throw new Error("Staff not found.");
        }

        if (!tenantStaff.password) {
            throw new Error("create your password.");
        }

        const isPasswordValid = await argon2.verify(tenantStaff.password, data.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password.");
        }

        return { ...tenantStaff, token: this.token.generateToken(tenantStaff.id) };
    }

    async tenantAdminChoices(data) {
        const choiceExists = await this.choiceRepository.findFirst({ tenantId: data.tenantId });

        if (choiceExists) {
            if (data.setForAll && choiceExists && choiceExists.Authenticator2FA !== data.Authenticator2FA && choiceExists.securityQuestion !== data.securityQuestion) {
                const reset = this.staffRepository.updateAll(data.tenantId, {
                    authType: data.Authenticator2FA ? "AUTHENTICATOR" : "SECRETMESSAGE",
                    authQuestion: null,
                    auth2FADone: false
                })

                if (!reset) {
                    throw new Error("Failed to reset all");
                }

                const deleted = this.authRepository.deleteMany({ module: "TENANT" })

                if (!deleted) {
                    throw new Error("Failed to delete auth");
                }
            }

            const update = await this.choiceRepository.update(choiceExists.id, {
                Authenticator2FA: data.Authenticator2FA,
                securityQuestion: data.securityQuestion,
                setForAll: data.setForAll
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

    async getChoices(tenantId) {
        const choice = await this.choiceRepository.findFirst({ tenantId });

        if (!choice) {
            throw new Error("choice not found")
        }

        return choice;
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

        const html = `
        <body style="margin: 0%; padding: 0%; box-sizing: border-box; background-color: white;">
            <main>
                <img src="/mailHeader.png" alt="" style="width: 100%; height: 70px; object-fit: cover;">
                <div
                    style="font-family: Arial, Helvetica, sans-serif; text-align: center; max-width: 820px; margin: auto; padding: 20px; padding-bottom: 50px;">
                    <img src="/logo.png" alt="" style="width: 230px; margin-top: 70px;">
                    <p class="head" style="font-size: 26px; font-weight: 700; margin-top: 70px;">Reset your password</p>
                    <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">Please click the button
                        below to reset your password</p>
                    <a href="http://localhost:5173/auth/reset-password/${staffExists.id}" style="background-color: black; text-align: center; border-radius: 9999px; padding-top: 20px; padding-bottom: 20px; color: white; text-decoration: none; font-weight: 600; font-size: 18px; width: 90%; display: block; margin: auto;">Reset Password</a>
                </div>
            </main>
        </body>
        `
        const sendMail = MailService.sendMail(staffExists.email, "Reset your password", null, html, attachments)
        if (!sendMail) {
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
}

export default TenantService;
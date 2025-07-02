import MailService from '../../../utilities/nodemailer.js';
import Tenant from '../domain/tenant.js';
import argon2 from "argon2";

class TenantService {
    constructor({ tenantRepository, prisma, departmentRepository, roleRepository, staffRepository, pipelineRepository, itemRepository, generateCode, choiceRepository, authRepository }) {
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

        const createData = new Tenant(data)

        const newCandidate = await this.prisma.$transaction(async (tx) => {
            const tenant = await this.tenantRepository.txCreate(createData.createTenant, tx);
            const pipeline = await this.pipelineRepository.txCreate({
                module: "CLIENT",
                name: "Client Onboarding",
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

            return pipelineItem;
        }, { timeout: 10_000 });

        if (!newCandidate) {
            throw new Error("Failed to create candidate");
        }

        return newCandidate;
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
            stage: data.stage || tenant.stage
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
            where: {
                email: data.email,
                tenantId: data.tenantId
            }
        });

        if (tenantStaff) {
            throw new Error("Staff already exists.");
        }

        const generatedPass = this.generateCode.generateStrongPassword()
        const hashedPass = await argon2.hash(generatedPass)
        const createData = new Tenant({ ...data, password: hashedPass });

        const newStaff = await this.staffRepository.create(createData.createTenantStaff);

        if (!newStaff) {
            throw new Error("Failed to create staff");
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
                <img src="cid:unique2@image" alt="" style="width: 100%; height: 70px; object-fit: cover;">
                <div
                    style="font-family: Arial, Helvetica, sans-serif; max-width: 820px; margin: auto; padding: 20px; padding-bottom: 50px;">
                    <img src="cid:unique@image" alt="" style="width: 230px; margin-top: 50px;">
                    <p class="head" style="font-size: 26px; font-weight: 700; margin-top: 30px;">Welcome to NooSphere</p>
                    <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">You've been invited to
                        join the NooSphere Control Platform as the Administrator. Click the button below to log in using your
                        administrator credentials:<br><br>Email: ${data.email}<br>Password: ${generatedPass}</p>
                    <a href="http://localhost:5173/" style="background-color: black; border-radius: 9999px; padding-top: 20px; padding-bottom: 20px; color: white; text-decoration: none; font-weight: 600; font-size: 18px; width: 90%; text-align: center; display: block; margin: auto;">Login as Administrator</a>
                        <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">Once you're in, you'll be prompted to:<br><br>1. Set a new password<br>2. Configure 2-factor authentication<br>3. Set platform-wide preferences for your team<br><br>We recommend doing these right away to secure your account and prepare the system for other users.<br><br>Welcome aboard,<br>— The NooSphere Team</p>
                        </div>
                        </main>
        </body>
        `
        const sendMail = await MailService.sendMail(data.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return newStaff;
    }

    async tenantStaffLogin(data) {
        const tenantStaff = await this.staffRepository.findFirst({
            where: {
                email: data.email,
                tenantId: data.tenantId
            }
        });

        if (!tenantStaff) {
            throw new Error("Staff not found.");
        }

        const isPasswordValid = await argon2.verify(tenantStaff.password, data.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password.");
        }

        return tenantStaff;
    }

    async tenantAdminChoices(data) {
        const choiceExists = await this.choiceRepository.findFirst({});

        if (choiceExists) {
            if (data.setForAll && choiceExists && choiceExists.Authenticator2FA !== data.Authenticator2FA && choiceExists.securityQuestion !== data.securityQuestion) {
                const reset = this.staffRepository.updateAll({
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

    async getChoices() {
        const choice = await this.choiceRepository.findOne({});

        if (!choice) {
            throw new Error("choice not found")
        }

        return choice;
    }

    async forgotPassword(data) {
        const staffExists = await this.staffRepository.staffExistsWithRole({ email: data.email });

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
                    <a href="http://localhost:5173/SA/reset-password/${staffExists.id}" style="background-color: black; text-align: center; border-radius: 9999px; padding-top: 20px; padding-bottom: 20px; color: white; text-decoration: none; font-weight: 600; font-size: 18px; width: 90%; display: block; margin: auto;">Reset Password</a>
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

        const update = await this.repository.update(data.id, {
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
}

export default TenantService;
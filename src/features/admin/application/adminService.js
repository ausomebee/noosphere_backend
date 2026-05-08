import TokenService from '../../../utilities/generate_token.js';
import AdminRepository from '../infrastructure/adminRepository.js';
import argon2 from "argon2";
import MailService from '../../../utilities/nodemailer.js';
import ReferralCodeGenerator from '../../../utilities/generateCode.js';
import DepartmentRepository from '../../departmentAndTeams/infrastructure/departmentRepository.js';
import RoleRepository from '../../role/infrastructure/roleRepository.js';
import AuthRepository from '../../auth/infrastructure/authRepository.js';
import templateRenderer from '../../../utilities/templateRenderer.js';

class AdminService {
    constructor() {
        this.repository = new AdminRepository()
        this.token = TokenService
        this.generateCode = new ReferralCodeGenerator(12)
        this.departmentRepository = new DepartmentRepository()
        this.roleRepository = new RoleRepository()
        this.authRepository = new AuthRepository()
    }

    async createAdmin(data) {
        const adminExists = await this.repository.findFirst({
            where: { OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }] },
            select: { email: true, phoneNumber: true }
        });

        if (adminExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (adminExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        const newAdmin = await this.repository.create(data);

        if (!newAdmin) {
            throw new Error("Failed to create admin");
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

        const html = await templateRenderer.render('admin-invitation.html', { email: newAdmin.email, adminId: newAdmin.id });
        const sendMail = await MailService.sendMail(newAdmin.email, "Welcome to Noosphere", null, html, attachments)
        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return newAdmin;
    }

    async updateAdmin(data) {
        const admin = await this.repository.findOne({ id: data.id })

        if (!admin) {
            throw new Error("Admin not found");
        }

        if (data.currentPassword && !(await argon2.verify(admin.password, data.currentPassword))) {
            throw new Error('Incorrect password')
        }

        const hashedPass = data.password ? await argon2.hash(data.password) : admin.password;

        if (data.newAdministratorPassword && !(await argon2.verify(admin.administratorPassword, data.oldAdministratorPassword))) {
            throw new Error('Incorrect current password')
        }
        const hashedAdminPass = data.newAdministratorPassword ? await argon2.hash(data.newAdministratorPassword) : admin.administratorPassword;

        const update = await this.repository.update(data.id, {
            fullName: data.fullName || admin.fullName,
            email: data.email || admin.email,
            phoneNumber: data.phoneNumber || admin.phoneNumber,
            active: data.active ?? admin.active,
            roles: {
                connect: {
                    id: data.roleId || admin.roleId
                }
            },
            password: hashedPass,
            administratorPassword: hashedAdminPass,
            authType: data.authType || admin.authType,
            authQuestion: data.authQuestion || admin.authQuestion,
            auth2FADone: data.auth2FADone ?? admin.auth2FADone,
        });

        if (!update) {
            throw new Error("Failed to update admin");
        }

        return update;
    }

    async createSuperAdmin(data) {
        const superAdminExists = await this.repository.findFirst({
            where: { superAdmin: true },
            select: { superAdmin: true }
        });

        if (superAdminExists) {
            throw new Error("There's already a super admin");
        }

        const adminExists = await this.repository.findFirst({
            where: { OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }] },
            select: { email: true, phoneNumber: true }
        });

        if (adminExists?.email === data.email) {
            throw new Error("This email is already taken.");
        }

        if (adminExists?.phoneNumber === data.phoneNumber) {
            throw new Error("This phone number is already taken.");
        }

        data.superAdmin = true;
        const generatedPass = this.generateCode.generateStrongPassword()
        const hashedPass = await argon2.hash(generatedPass)
        const generatedAdminPass = this.generateCode.generateStrongPassword()
        const hashedAdminPass = await argon2.hash(generatedAdminPass)

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

        const html = templateRenderer.render('admin-welcome-credentials.html', { email: data.email, password: generatedPass });
        const sendMail = await MailService.sendMail(data.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        const html2 = templateRenderer.render('admin-password-delivery.html', { adminPassword: generatedAdminPass });
        const sendMail2 = await MailService.sendMail(data.email, "Your Administrator Password", null, html2, attachments)

        if (!sendMail2.success) {
            throw new Error("Failed to send mail");
        }

        const newAdmin = await this.repository.prisma.$transaction(async (tx) => {
            const role = await this.roleRepository.createAdminRole("GLOBAL", null, tx);
            const admin = await this.repository.txCreate({ ...data, password: hashedPass, administratorPassword: hashedAdminPass, roleId: role.id }, tx);
            const department = await tx.department.create({
                data: {
                    name: "General",
                    teamLeadId: admin.id,
                    createdByAdminId: admin.id,
                },
            });
            await tx.departmentMembers.create({
                data: {
                    adminId: admin.id,
                    departmentId: department.id,
                },
            });

            return admin;
        }, { timeout: 10_000 });

        if (!newAdmin) {
            throw new Error("Failed to create admin");
        }

        return newAdmin;
    }

    async AdminSignin(data) {
        const admin = await this.repository.findAdmin({
            email: data.email
        });

        if (!admin) {
            throw new Error("You don't have an account")
        }

        if (!admin.password) {
            throw new Error("You haven't set your password")
        }

        if (!(await argon2.verify(admin.password, data.password))) {
            throw new Error('Incorrect password')
        }

        const claims = {
            id: admin.id,
            role: admin.roles.name,
            permissions: admin.roles
        }

        return { ...admin, accessToken: this.token.generateAccessToken(claims), refreshToken: this.token.generateRefreshToken(admin.id, "ADMIN") };
    }

    async verifyPassword(data) {
        const admin = await this.repository.findAdmin({
            id: data.id
        });

        if (!admin) {
            throw new Error("admin not found")
        }

        if (!(await argon2.verify(admin.password, data.password))) {
            throw new Error('Incorrect password')
        }

        return true;
    }

    async getSingleAdmin(data) {
        const admin = await this.repository.findOne({
            id: data.id
        });

        if (!admin) {
            throw new Error("Admin not found")
        }

        return admin;
    }

    async getSuperAdmin(data) {
        const admin = await this.repository.findFirst({
            superAdmin: true
        });

        if (!admin) {
            throw new Error("Admin not found")
        }

        return admin;
    }

    async getAdminsWithTeamAccess(data) {
        const admin = await this.repository.getAdminsWithTeamAccess();

        if (!admin) {
            throw new Error("Admins not found")
        }

        return admin;
    }

    async getAllAdmin() {
        const admins = await this.repository.findAll({
            include: {
                roles: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        if (!admins) {
            throw new Error("Failed to fetch admins")
        }

        return admins;
    }

    async superAdminChoices(data) {
        const choiceExists = await this.repository.findFirstChoice({ where: {} });

        if (choiceExists) {
            if (data.setForAll && choiceExists && choiceExists.Authenticator2FA !== data.Authenticator2FA && choiceExists.securityQuestion !== data.securityQuestion) {
                const reset = this.repository.updateAll({
                    authType: data.Authenticator2FA ? "AUTHENTICATOR" : "SECRETMESSAGE",
                    authQuestion: null,
                    auth2FADone: false
                })

                if (!reset) {
                    throw new Error("Failed to reset all");
                }

                const deleted = this.authRepository.deleteMany({ module: "ADMIN" })

                if (!deleted) {
                    throw new Error("Failed to delete auth");
                }
            }

            const update = await this.repository.updateChoice(choiceExists.id, {
                Authenticator2FA: data.Authenticator2FA,
                securityQuestion: data.securityQuestion,
                setForAll: data.setForAll
            });

            if (!update) {
                throw new Error("Failed to update choice");
            }

            return update;
        }

        const newChoice = await this.repository.createChoice(data);

        if (!newChoice) {
            throw new Error("Failed to create choice");
        }

        return newChoice;
    }

    async getChoices() {
        const choice = await this.repository.findOneChoice({});

        if (!choice) {
            throw new Error("choice not found")
        }

        return choice;
    }

    async forgotPassword(data) {
        const adminExists = await this.repository.findFirst({
            where: { email: data.email },
        });

        if (!adminExists) {
            throw new Error("Admin not found.");
        }

        if (!adminExists.auth2FADone && adminExists.superAdmin) {
            throw new Error("2FA required.");
        }

        const setAll = await this.repository.findFirstChoice({});

        if (!adminExists.auth2FADone && setAll.setForAll) {
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

        const html = await templateRenderer.render('admin-password-reset.html', { adminId: adminExists.id });
        const sendMail = await MailService.sendMail(adminExists.email, "Reset your password", null, html, attachments)
        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return true;
    }
}

export default AdminService;
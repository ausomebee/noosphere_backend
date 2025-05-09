import TokenService from '../../../utilities/generate_token.js';
import AdminRepository from '../infrastructure/adminRepository.js';
import argon2 from "argon2";
import MailService from '../../../utilities/nodemailer.js';
import ReferralCodeGenerator from '../../../utilities/generateCode.js';
import DepartmentRepository from '../../department/infrastructure/departmentRepository.js';
import RoleRepository from '../../role/infrastructure/roleRepository.js';
import AuthRepository from '../../auth/infrastructure/authRepository.js';

class AdminService {
    constructor() {
        this.repository = new AdminRepository()
        this.token = new TokenService()
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

        const html = `
        <body style="margin: 0%; padding: 0%; box-sizing: border-box;">
            <main>
                <img src="cid:unique2@image" alt="" style="width: 100%; height: 100px; object-fit: cover;">
                <div
                    style="text-align: center; font-family: Arial, Helvetica, sans-serif; max-width: 820px; margin: auto; padding: 20px; padding-bottom: 50px;">
                    <img src="cid:unique@image" alt="" style="width: 230px; margin-top: 50px;">
                    <p class="head" style="font-size: 26px; font-weight: 700; margin-top: 30px;">Hello there,<br>Get started on Noosphere
                    </p>
                    <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">You have been invited by
                        NooSphere Admin to<br> create a profile on Noosphere<br><br>Click the button below to get started</p>
                    <a href='http://localhost:5173/admin/onboarding/${newAdmin.email}/${newAdmin.id}'
                        style="background-color: black; color: white; font-size: 20px; width: 80%; margin: auto; padding-top: 20px; padding-bottom: 20px; border-radius: 9999px;">Create
                        Profile</a>
                </div>
            </main>
        </body>
        `
        const sendMail = MailService.sendMail(newAdmin.email, "Welcome to Noosphere", null, html, attachments)
        if (!sendMail) {
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
            roles: {
                connect: {
                    id: data.roleId || admin.roleId
                }
            },
            password: hashedPass,
            administratorPassword: hashedAdminPass,
            authType: data.authType || admin.authType,
            authQuestion: data.authQuestion || admin.authQuestion,
            auth2FADone: data.auth2FADone || admin.auth2FADone,
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

        // const newAdmin = await this.repository.create({ ...data, password: hashedPass, administratorPassword: hashedAdminPass });

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
                    <a href="http://localhost:5173/"
                        style="background-color: black; color: white; font-size: 20px; width: 80%; margin: auto; padding-top: 20px; padding-bottom: 20px; border-radius: 9999px;">Login
                        as Administrator</a>
                        <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">Once you're in, you'll be prompted to:<br><br>1. Set a new password<br>2. Configure 2-factor authentication<br>3. Set platform-wide preferences for your team<br><br>We recommend doing these right away to secure your account and prepare the system for other users.<br><br>Welcome aboard,<br>— The NooSphere Team</p>
                        </div>
                        </main>
        </body>
        `
        const sendMail = await MailService.sendMail(data.email, "Welcome to Noosphere", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        const html2 = `
        <body style="margin: 0%; padding: 0%; box-sizing: border-box; background-color: white;">
        <main>
        <img src="cid:unique2@image" alt="" style="width: 100%; height: 90px; object-fit: cover;">
        <div
        style="font-family: Arial, Helvetica, sans-serif; max-width: 820px; margin: auto; padding: 20px; padding-bottom: 50px;">
        <img src="cid:unique@image" alt="" style="width: 230px; margin-top: 50px;">
        <p class="head" style="font-size: 26px; font-weight: 700; margin-top: 30px;">Your Administrator Password</p>
        <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">You're receiving this message because you've been designated as the Administrator for the NooSphere Control Platform.<br><br>
        Below is your Administrator Password, used to authorize sensitive, system-wide actions within the platform.<br><br><span style="font-weight: 700;">Administrator password:</span> ${generatedAdminPass}</p>
        <p style="color: #475467; font-size: 18px; margin-top: 20px; margin-bottom: 50px;">1. You'll be required to set a new Administrator Password as soon as you log in.<br>
        2. You will also need to change your Administrator Password every 90 days to ensure maximum security.<br><br>
        Please keep this token secure. <br><br>If you didn't expect this, contact <a>security@noosphere.com</a>.<br><br>
        — The NooSphere Security Team</p>
        </div>
        </main>
        </body>
        `
        const sendMail2 = await MailService.sendMail(data.email, "Your Administrator Password", null, html2, attachments)

        if (!sendMail2.success) {
            throw new Error("Failed to send mail");
        }

        const newAdmin = await this.repository.prisma.$transaction(async (tx) => {
            const department = await this.departmentRepository.createAdminDepartment(tx);
            const role = await this.roleRepository.createAdminRole(department.id, tx)
            const admin = await this.repository.txCreate({ ...data, password: hashedPass, administratorPassword: hashedAdminPass, roleId: role.id }, tx);

            return admin;
        });

        if (!newAdmin) {
            throw new Error("Failed to create admin");
        }

        return newAdmin;
    }

    async AdminSignin(data) {
        const admin = await this.repository.findOne({
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

        return { ...admin, token: this.token.generateToken(admin.id) };
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
                    <a href="http://localhost:5173/SA/reset-password/${adminExists.id}" style="background-color: black; border-radius: 9999px; padding-top: 20px; padding-bottom: 20px; color: white; text-decoration: none; font-weight: 600; font-size: 18px; width: 90%; display: block; margin: auto;">Reset Password</a>
                </div>
            </main>
        </body>
        `
        const sendMail = MailService.sendMail(adminExists.email, "Reset your password", null, html, attachments)
        if (!sendMail) {
            throw new Error("Failed to send mail");
        }

        return true;
    }
}

export default AdminService;
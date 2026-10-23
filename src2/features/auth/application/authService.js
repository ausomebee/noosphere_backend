import speakeasy from "speakeasy";
import qrcode from "qrcode";
import AuthRepository from "../infrastructure/authRepository.js";
import argon2 from "argon2";
import AdminService from "../../admin/application/adminService.js";
import TenantService from "../../tenant/application/tenantService.js";
import prismaService from "../../../config/prisma.js";
import TenantRepository from "../../tenant/infrastructure/tenantRepository.js";
import StaffRepository from "../../tenant/infrastructure/staffRepository.js";

class AuthService {
    constructor() {
        this.repository = new AuthRepository();
        this.adminService = new AdminService;
        this.prisma = prismaService.getClient();
        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.tenantService = new TenantService({
            tenantRepository: this.tenantRepository,
            staffRepository: this.staffRepository
        });
    }

    async generateAuthenticator(data) {
        const secret = speakeasy.generateSecret({ name: "Noosphere" });
        const qrCode = await qrcode.toDataURL(secret.otpauth_url);
        const authExists = await this.repository.findOne({ userId: data.userId });

        let auth
        if (authExists) {
            auth = await this.repository.update(authExists.id, { secret: secret.base32 });
            if (!auth) {
                throw new Error("Auth failed")
            }
        } else {
            auth = await this.repository.create({ userId: data.userId, secret: secret.base32, module: data.module });
            if (!auth) {
                throw new Error("Auth failed")
            }
        }

        const update = await this.adminService.updateAdmin({
            authType: "AUTHENTICATOR",
            id: auth.userId
        })

        if (!update) {
            throw new Error("update failed")
        }

        return {
            otpauth_url: secret.otpauth_url,
            base32: secret.base32,
            qrcode: qrCode
        };
    }

    async verifyCode(data) {
        const secret = await this.repository.findOne({ userId: data.userId });

        if (!secret) {
            throw new Error("No 2FA secret found for this user.");
        }

        const verified = speakeasy.totp.verify({
            secret: secret.secret,
            encoding: "base32",
            token: data.token
        });

        if (!verified) {
            throw new Error("verify failed")
        }

        const update = await this.adminService.updateAdmin({
            auth2FADone: true,
            id: data.userId
        })

        if (!update) {
            throw new Error("update failed")
        }
        return verified;
    }

    async createSecreteMessage(data) {
        const hashedSecret = await argon2.hash(data.secret);

        const update = await this.adminService.updateAdmin({
            authType: "SECRETMESSAGE",
            auth2FADone: true,
            authQuestion: data.authQuestion,
            id: data.userId
        })

        const auth = await this.repository.create({ userId: data.userId, secret: hashedSecret, module: data.module });
        if (!auth) {
            throw new Error("Auth failed")
        }

        if (!update) {
            throw new Error("update failed")
        }

        return auth;
    }

    async verifySecretMessage(data) {
        const secret = await this.repository.findOne({ userId: data.userId });

        if (!secret) {
            throw new Error("No 2FA secret found for this user.");
        }

        if (!(await argon2.verify(secret.secret, data.secret))) {
            throw new Error('Incorrect secret')
        }

        return true;
    }

    async generateTenantAuthenticator(data) {
        const secret = speakeasy.generateSecret({ name: "Noosphere" });
        const qrCode = await qrcode.toDataURL(secret.otpauth_url);
        const authExists = await this.repository.findOne({ userId: data.userId });

        let auth
        if (authExists) {
            auth = await this.repository.update(authExists.id, { secret: secret.base32 });
            if (!auth) {
                throw new Error("Auth failed")
            }
        } else {
            auth = await this.repository.create({ userId: data.userId, secret: secret.base32, module: data.module });
            if (!auth) {
                throw new Error("Auth failed")
            }
        }

        const update = await this.tenantService.updateStaff({
            authType: "AUTHENTICATOR",
            id: auth.userId
        })

        if (!update) {
            throw new Error("update failed")
        }

        return {
            otpauth_url: secret.otpauth_url,
            base32: secret.base32,
            qrcode: qrCode
        };
    }

    async verifyStaffCode(data) {
        const secret = await this.repository.findOne({ userId: data.userId });

        if (!secret) {
            throw new Error("No 2FA secret found for this user.");
        }

        const verified = speakeasy.totp.verify({
            secret: secret.secret,
            encoding: "base32",
            token: data.token
        });

        if (!verified) {
            throw new Error("verify failed")
        }

        const update = await this.tenantService.updateStaff({
            auth2FADone: true,
            id: data.userId
        })

        if (!update) {
            throw new Error("update failed")
        }
        return verified;
    }

    async createStaffSecreteMessage(data) {
        const hashedSecret = await argon2.hash(data.secret);

        const update = await this.tenantService.updateStaff({
            authType: "SECRETMESSAGE",
            auth2FADone: true,
            authQuestion: data.authQuestion,
            id: data.userId
        })

        const auth = await this.repository.create({ userId: data.userId, secret: hashedSecret, module: data.module });
        if (!auth) {
            throw new Error("Auth failed")
        }

        if (!update) {
            throw new Error("update failed")
        }

        return auth;
    }

    async verifyStaffSecretMessage(data) {
        const secret = await this.repository.findOne({ userId: data.userId });

        if (!secret) {
            throw new Error("No 2FA secret found for this user.");
        }

        if (!(await argon2.verify(secret.secret, data.secret))) {
            throw new Error('Incorrect secret')
        }

        return true;
    }

    // async deleteForModule(module) {
    //     const deleted = await this.repository.deleteMany({ module: module });
    //     if (!deleted) {
    //         throw new Error("failed to delete")
    //     }

    //     return true;
    // }
}

export default AuthService;
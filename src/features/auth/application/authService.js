import speakeasy from "speakeasy";
import qrcode from "qrcode";
import AuthRepository from "../infrastructure/authRepository.js";

class AuthService {
    constructor() {
        this.repository = new AuthRepository();
    }

    async generateAuthenticator(userId) {
        const secret = speakeasy.generateSecret({ name: "Noosphere" });
        const qrCode = await qrcode.toDataURL(secret.otpauth_url);

        const auth = await this.repository.create({ userId: userId, secret: secret.base32 });
        if (!auth) {
            throw new Error("Auth failed")
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

        return verified;
    }
}

export default AuthService;
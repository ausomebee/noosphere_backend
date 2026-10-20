import jwt from "jsonwebtoken";
import argon2 from "argon2";
import RefreshTokenRepository from "../infrastructure/refreshTokenRepository.js";

class RefreshTokenService {
    constructor() {
        this.repository = new RefreshTokenRepository();
        this.refreshSecret =
            process.env.REFRESH_TOKEN_SECRET || "fghjbhsdbsdhjs";
    }

    async createRefreshToken(data) {
        const {
            ownerId,
            ownerType,
            refreshToken, 
            fingerprint,
            expiresAt,
        } = data;

        const tokenHash = await argon2.hash(refreshToken);

        const created = await this.repository.create({
            ownerId,
            ownerType,
            tokenHash,
            fingerprint,
            expiresAt,
        });

        if (!created) {
            throw new Error("Failed to create refresh token");
        }

        return created;
    }

    async verifyRefreshToken(data) {
        const { refreshToken, fingerprint } = data;

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, this.refreshSecret);
        } catch (err) {
            throw new Error("Invalid or expired refresh token");
        }

        const storedTokens = await this.repository.findAll({
            where: {
                fingerprint,
                used: false,
            },
        });

        if (!storedTokens.length) {
            throw new Error("Refresh token not found");
        }

        let matchedToken = null;
        for (const token of storedTokens) {
            if (await argon2.verify(token.tokenHash, refreshToken)) {
                matchedToken = token;
                break;
            }
        }

        if (!matchedToken) {
            throw new Error("Refresh token reuse detected");
        }

        if (matchedToken.expiresAt < new Date()) {
            throw new Error("Refresh token expired");
        }

        return matchedToken;
    }

    async rotateRefreshToken(data) {
        const {
            oldRefreshToken,
            newRefreshToken,
            fingerprint,
            ownerId,
            ownerType,
            expiresAt,
        } = data;

        const existing = await this.verifyRefreshToken({
            refreshToken: oldRefreshToken,
            fingerprint,
        });

        await this.repository.update(existing.id, { used: true });

        const newTokenHash = await argon2.hash(newRefreshToken);

        const created = await this.repository.create({
            ownerId,
            ownerType,
            tokenHash: newTokenHash,
            fingerprint,
            expiresAt,
        });

        if (!created) {
            throw new Error("Failed to rotate refresh token");
        }

        return created;
    }

    async revokeRefreshToken(id) {
        const revoked = await this.repository.update(id, { used: true });

        if (!revoked) {
            throw new Error("Failed to revoke refresh token");
        }

        return true;
    }

    async revokeAllForOwner(ownerId) {
        const revoked = await this.repository.deleteMany({
            ownerId,
        });

        if (!revoked) {
            throw new Error("Failed to revoke refresh tokens");
        }

        return true;
    }

    async revokeByFingerprint(ownerId, fingerprint) {
        const revoked = await this.repository.updateMany({
            where: {
                ownerId,
                fingerprint,
            },
            data: { used: true },
        });

        if (!revoked) {
            throw new Error("Failed to revoke refresh tokens");
        }

        return true;
    }
}

export default RefreshTokenService;

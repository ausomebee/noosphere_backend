import { createHash, randomBytes } from "node:crypto";

export function hashResetToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

export async function issuePasswordResetToken(prisma, { ownerId, ownerType, expiresInMs = 60 * 60 * 1000 }) {
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + expiresInMs);

    await prisma.passwordResetToken.updateMany({
        where: { ownerId, ownerType, usedAt: null },
        data: { usedAt: new Date() },
    });
    await prisma.passwordResetToken.create({ data: { ownerId, ownerType, tokenHash, expiresAt } });
    return token;
}

export async function consumePasswordResetToken(prisma, { token, ownerId, ownerType }) {
    if (typeof token !== "string" || token.length < 40 || token.length > 128) {
        const error = new Error("Invalid or expired password reset token");
        error.name = "Unauthorized";
        throw error;
    }
    const result = await prisma.passwordResetToken.updateMany({
        where: {
            tokenHash: hashResetToken(token),
            ownerId,
            ownerType,
            usedAt: null,
            expiresAt: { gt: new Date() },
        },
        data: { usedAt: new Date() },
    });
    if (result.count !== 1) {
        const error = new Error("Invalid or expired password reset token");
        error.name = "Unauthorized";
        throw error;
    }
}

import jwt from "jsonwebtoken";

class TokenService {
    static generateAccessToken(claims) {
        return jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET || "secret", {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
        });
    }

    static generateRefreshToken() {
        return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET || "secret", {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
        });
    }

    static generatePaymentToken(claims) {
        return jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET || "secret", {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "1d",
        });
    }

    static validatePaymentToken(token) {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");
    }

    static async generateClinicalReportToken(id, prisma) {
        const report = await prisma.clinicalReport.update({
            where: { id },
            data: {
                tokenVersion: {
                    increment: 1
                }
            }
        });

        return jwt.sign(
            {
                id: report.id,
                tokenVersion: report.tokenVersion
            },
            process.env.CLINICAL_REPORT_SECRET || "clinical_secret",
            {
                expiresIn: process.env.CLINICAL_REPORT_EXPIRE || "1d",
            }
        );
    }

    static async validateClinicalReportToken(token, prisma) {
        const decoded = jwt.verify(
            token,
            process.env.CLINICAL_REPORT_SECRET || "clinical_secret"
        );

        const report = await prisma.clinicalReport.findUnique({
            where: { id: decoded.id }
        });

        if (!report) {
            throw new Error("Report not found");
        }

        if (report.tokenVersion !== decoded.tokenVersion) {
            throw new Error("Token expired");
        }

        return decoded;
    }

    static async withdrawClinicalReportToken(id, prisma) {
        await prisma.clinicalReport.update({
            where: { id },
            data: {
                tokenVersion: {
                    increment: 1
                }
            }
        });

        return true;
    }

}

export default TokenService;

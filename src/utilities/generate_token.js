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
}

export default TokenService;

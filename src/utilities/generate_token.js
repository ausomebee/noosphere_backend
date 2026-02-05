import jwt from "jsonwebtoken";

class TokenService {
    constructor() {
        this.accessSecret = process.env.ACCESS_TOKEN_SECRET || "hgsdjbsbhghdbbd";
        this.refreshSecret = process.env.REFRESH_TOKEN_SECRET || "fghjbhsdbsdhjs";

        this.accessExpire = process.env.ACCESS_TOKEN_EXPIRE || "15m";
        this.refreshExpire = process.env.REFRESH_TOKEN_EXPIRE || "7d";
    }

    generateAccessToken(claims) {
        return jwt.sign(claims, this.accessSecret, {
            expiresIn: this.accessExpire,
        });
    }

    generateRefreshToken() {
        return jwt.sign({}, this.refreshSecret, {
            expiresIn: this.refreshExpire,
        });
    }
}

export default TokenService;

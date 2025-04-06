import jwt from "jsonwebtoken";

class TokenService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.expire = process.env.JWT_EXPIRE || "1h";
    }

    generateToken(id) {
        return jwt.sign({ id }, this.secret, {
            expiresIn: this.expire,
        });
    }
}
export default TokenService;
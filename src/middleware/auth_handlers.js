import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import prismaService from "../config/prisma.js";

class ProtectMiddleware {
    constructor(model, userType) {
        this.model = model;
        this.userType = userType;
    }

    protect() {
        return asyncHandler(async (req, res, next) => {
            let token;

            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                try {
                    token = req.headers.authorization.split(" ")[1];

                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await this.model.findUnique({
                        where: { id: decoded.id },
                    });

                    if (!user) {
                        res.status(401);
                        throw new Error("Not Authorized");
                    }

                    req[this.userType] = user;

                    next();
                } catch (error) {
                    console.error(error);
                    res.status(401);
                    next(`Not Authorized`);
                }
            }

            if (!token) {
                res.status(401);
                next(`Not Authorized`);
            }
        });
    }
}

const prisma = prismaService.getClient();

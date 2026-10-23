import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import prismaService from "../config/prisma.js";

class ProtectMiddleware {
    constructor(model, userType) {
        this.model = model;
        this.userType = userType;
    }

    protect(allowedRoles = {}) {
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
                        select: {
                            id: true,
                            superAdmin: true,
                            roles: {
                                select: {
                                    access: true
                                }
                            }
                        }
                    });

                    if (allowedRoles.superAdmin && !user.superAdmin) {
                        res.status(403);
                        throw new Error("Forbidden: Access denied");
                    }

                    if (allowedRoles.access && !user.roles.access[allowedRoles.access]) {
                        res.status(403);
                        throw new Error("Forbidden: Access denied");
                    }

                    if (!user) {
                        res.status(401);
                        throw new Error("Not Authorized");
                    }

                    req[this.userType] = user;

                    next();
                } catch (error) {
                    console.error(error);
                    res.status(401);
                    return next(new Error(error));
                }
            }

            if (!token) {
                res.status(401);
                return next(new Error("Not Authorized"));
            }
        });
    }
}

const prisma = prismaService.getClient();

export const clientProtect = new ProtectMiddleware(prisma.client, "client").protect();
export const staffProtect = new ProtectMiddleware(prisma.tenantStaff, "tenantStaff").protect();

export const adminProtect = (roles = {}) => new ProtectMiddleware(prisma.admin, "admin").protect(roles);
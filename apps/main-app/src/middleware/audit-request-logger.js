import auditLogger from "../features/logs/application/auditLogger.js";

const featureNameFromPath = (path) => {
    const resource = path.split("?")[0].split("/").filter(Boolean)[2];
    return resource
        ? resource.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
        : "API";
};

const auditRequestLogger = (req, res, next) => {
    if (!["POST", "PATCH"].includes(req.method)) {
        return next();
    }

    res.on("finish", () => {
        if (req.auditLogged) {
            return;
        }

        const user = req.user;
        const succeeded = res.statusCode >= 200 && res.statusCode < 400;

        auditLogger.log(req, {
            tenantId: user?.tenantId || req.body?.tenantId || null,
            clientId: user?.type === "CLIENT" ? user.clientId : req.body?.clientId || null,
            adminId: user?.type === "ADMIN" ? user.id : null,
            module: user?.type === "ADMIN" ? "ADMIN" : user?.type === "STAFF" ? "TENANT" : user?.type === "CLIENT" ? "CLIENT" : null,
            feature: featureNameFromPath(req.originalUrl),
            action: `${req.method} ${req.originalUrl.split("?")[0]}`,
            reason: "API request",
            details: `Request completed with status ${res.statusCode}`,
            outcome: succeeded ? "SUCCESS" : "FAILURE",
            accessedBy: user?.name || null,
        });
    });

    next();
};

export default auditRequestLogger;
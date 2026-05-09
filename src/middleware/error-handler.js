class ErrorHandler {
    handleError(err, req, res, next) {
        switch (true) {
            case typeof err === "string": {
                const is404 = err.toLowerCase().endsWith("not found");
                const statusCode = is404 ? 404 : 400;
                return res.status(statusCode).json({ message: err });
            }

            case err.name === "ValidationError":
                return res.status(400).json({ message: err.message });

            case err.name === "Unauthorized":
                return res.status(401).json({ message: "Unauthorized" });

            // JWT errors
            case err.name === "TokenExpiredError":
                return res.status(401).json({ message: "Token expired" });

            case err.name === "JsonWebTokenError":
                return res.status(401).json({ message: "Invalid token" });

            case err.name === "NotBeforeError":
                return res.status(401).json({ message: "Token not yet active" });

            // Auth middleware sets res.status before calling next(err)
            case res.statusCode === 401:
                return res.status(401).json({ message: err.message || "Unauthorized" });

            case res.statusCode === 403:
                return res.status(403).json({ message: err.message || "Forbidden" });

            // Catch-all for auth-prefixed messages not already handled above
            case typeof err.message === "string" && err.message.startsWith("Not Authorized"):
                return res.status(401).json({ message: err.message });

            case typeof err.message === "string" && err.message.startsWith("Forbidden"):
                return res.status(403).json({ message: err.message });

            default:
                return res.status(500).json({ message: err.message });
        }
    }
}

const errorHandler = new ErrorHandler();

export default errorHandler;  
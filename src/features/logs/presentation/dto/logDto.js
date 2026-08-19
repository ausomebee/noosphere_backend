import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class LogsDto {
    static createLogDto = (req, res, next) => {
        const schema = Joi.object({
            adminId: Joi.string().uuid().optional().messages({
                "string.empty": "Admin ID is required",
                "string.guid": "Admin ID must be a valid UUID",
            }),
            clientId: Joi.string().uuid().optional().messages({
                "string.empty": "Client ID is required",
                "string.guid": "Client ID must be a valid UUID",
            }),
            tenantId: Joi.string().uuid().optional().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            feature: Joi.string().uuid().optional().messages({
                "string.empty": "Feature ID is required",
                "string.guid": "Feature ID must be a valid UUID",
            }),
            module: Joi.string().trim().required(),
            action: Joi.string().trim().required(),
            details: Joi.string().trim().optional(),
            ipAddress: Joi.string().trim().optional(),
            userAgent: Joi.string().trim().optional(),
            outcome: Joi.string().trim().optional(),
            accessedBy: Joi.string().trim().optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkIdDto = (req, res, next) => {
        const schema = Joi.object({
            logId: Joi.string().uuid().required().messages({
                "string.empty": "Log ID is required",
                "string.guid": "Log ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

}

export default LogsDto;
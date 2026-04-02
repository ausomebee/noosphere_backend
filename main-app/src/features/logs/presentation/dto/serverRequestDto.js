import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ServerRequestDto {
    static createRequestDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().optional().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            adminId: Joi.string().uuid().optional().messages({
                "string.empty": "Admin ID is required",
                "string.guid": "Admin ID must be a valid UUID",
            }),
            tenantStaffId: Joi.string().uuid().optional().messages({
                "string.empty": "Tenant Staff ID is required",
                "string.guid": "Tenant Staff ID must be a valid UUID",
            }),
            tenantClientId: Joi.string().uuid().optional().messages({
                "string.empty": "Tenant Client ID is required",
                "string.guid": "Tenant Client ID must be a valid UUID",
            }),
            method: Joi.string().trim().required().messages({
                "string.empty": "HTTP method is required",
            }),
            endpoint: Joi.string().trim().required().messages({
                "string.empty": "Endpoint is required",
            }),
            statusCode: Joi.number().integer().required().messages({
                "number.base": "Status code must be a number",
                "any.required": "Status code is required",
            }),
            durationMs: Joi.number().integer().required().messages({
                "number.base": "Duration must be a number in milliseconds",
                "any.required": "Duration is required",
            }),
            ipAddress: Joi.string().trim().optional(),
            userAgent: Joi.string().trim().optional(),
            errorMessage: Joi.string().trim().optional(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "Request ID is required",
                "string.guid": "Request ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };
}

export default ServerRequestDto;
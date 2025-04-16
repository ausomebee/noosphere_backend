import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class DepartmentDto {
    static adminCreateDepartmentDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .required()
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            description: Joi.string().trim().allow('').optional(),
            createdByAdminId: Joi.string().uuid().required().messages({
                "string.empty": "Admin ID is required",
                "string.guid": "Admin ID must be a valid UUID",
            }),
            access: Joi.object().required(),
            module: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static tenantCreateDepartmentDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .required()
                .max(20)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "string.max": "First name must not exceed 20 characters",
                }),
            description: Joi.string().trim().allow('').optional(),
            createdByTenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            access: Joi.object().required(),
            module: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default DepartmentDto;
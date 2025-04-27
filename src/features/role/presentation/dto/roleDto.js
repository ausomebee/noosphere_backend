import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class RoleDto {
    static createRoleDto = (req, res, next) => {
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
            departmentId: Joi.string().uuid().allow('').optional().messages({
                "string.guid": "Department ID must be a valid UUID",
            }),
            access: Joi.object().required(),
        });

        Validator.validateRequest(req, next, schema);
    };

    static departmentIdDto = (req, res, next) => {
        const schema = Joi.object({
            departmentId: Joi.string().uuid().required().messages({
                "string.empty": "Department ID is required",
                "string.guid": "Department ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };
}

export default RoleDto;
import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class RoleDto {
    static departmentIdDto = (req, res, next) => {
        const schema = Joi.object({
            departmentId: Joi.string().uuid().required().messages({
                "string.empty": "Department ID is required",
                "string.guid": "Department ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static createRoleDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .trim()
                .max(20)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            dataAccessLevel: Joi.string()
                .valid("GLOBAL", "INDIVIDUAL", "TEAM")
                .required()
                .messages({
                    "string.empty": "Data access level is required",
                    "any.only": "Data access level must be GLOBAL, INDIVIDUAL, or TEAM"
                }),
            systemModule: Joi.string()
                .optional()
                .allow(null, ''),
            createdByAdminId: Joi.string()
                .uuid()
                .optional()
                .allow(null, ''),
            createdByTenantId: Joi.string()
                .uuid()
                .optional()
                .allow(null, ''),
            moduleAccesses: Joi.array()
                .items(
                    Joi.object({
                        module: Joi.string()
                            .required()
                            .messages({
                                "string.empty": "Module is required"
                            }),

                        permissions: Joi.array()
                            .items(Joi.string().required())
                            .min(1)
                            .required()
                            .messages({
                                "array.min": "At least one permission is required"
                            })
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one module access must be provided"
                })
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateRoleDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "Role ID is required",
                "string.guid": "Role ID must be a valid UUID",
            }),
            name: Joi.string()
                .trim()
                .max(20)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            dataAccessLevel: Joi.string()
                .valid("GLOBAL", "INDIVIDUAL", "TEAM")
                .required()
                .messages({
                    "string.empty": "Data access level is required",
                    "any.only": "Data access level must be GLOBAL, INDIVIDUAL, or TEAM"
                }),
            moduleAccesses: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.string().uuid().optional().allow(null, ''),
                        module: Joi.string()
                            .optional()
                            .messages({
                                "string.empty": "Module is required"
                            }),
                        permissions: Joi.array()
                            .items(Joi.string().required())
                            .min(1)
                            .required()
                            .messages({
                                "array.min": "At least one permission is required"
                            })
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one module access must be provided"
                })
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default RoleDto;

import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";

class AdminDto {
    static createAdminDto = (req, res, next) => {
        const schema = Joi.object({
            firstName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "string.min": "First name must be at least 3 characters",
                    "string.max": "First name must not exceed 20 characters",
                }),
            lastName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Last name is required",
                    "string.min": "Last name must be at least 3 characters",
                    "string.max": "Last name must not exceed 20 characters",
                }),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
            phoneNumber: Joi.string()
                .required()
                .trim()
                .min(10)
                .max(15)
                .messages({
                    "string.empty": "Phone number is required",
                    "string.min": "Phone number must be at least 10 characters long",
                    "string.max": "Phone number must be at most 15 characters long"
                }),
            roleId: Joi.string().uuid().optional().messages({
                "string.guid": "Role ID must be a valid UUID",
            }),
            departmentId: Joi.string().uuid().optional().messages({
                "string.guid": "Department ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateAdminDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            firstName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "string.min": "First name must be at least 3 characters",
                    "string.max": "First name must not exceed 20 characters",
                }),
            lastName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Last name is required",
                    "string.min": "Last name must be at least 3 characters",
                    "string.max": "Last name must not exceed 20 characters",
                }),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
            phoneNumber: Joi.string()
                .required()
                .trim()
                .min(10)
                .max(15)
                .messages({
                    "string.empty": "Phone number is required",
                    "string.min": "Phone number must be at least 10 characters long",
                    "string.max": "Phone number must be at most 15 characters long"
                }),
            roleId: Joi.string().uuid().required().messages({
                "string.empty": "Role ID is required",
                "string.guid": "Role ID must be a valid UUID",
            }),
            departmentId: Joi.string().uuid().required().messages({
                "string.empty": "Department ID is required",
                "string.guid": "Department ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static createSuperAdminDto = (req, res, next) => {
        const schema = Joi.object({
            firstName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "string.min": "First name must be at least 3 characters",
                    "string.max": "First name must not exceed 20 characters",
                }),
            lastName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Last name is required",
                    "string.min": "Last name must be at least 3 characters",
                    "string.max": "Last name must not exceed 20 characters",
                }),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
            phoneNumber: Joi.string()
                .required()
                .trim()
                .pattern(/^\+?\d{10,15}$/)
                .messages({
                    "string.empty": "Phone number is required",
                    "string.pattern.base": "Phone number must be 10 to 15 digits and may start with +"
                })
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateAdminPasswordDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            password: Joi.string()
                .regex(strongPasswordRegex)
                .trim().required()
                .messages({
                    "string.pattern.base": stringPasswordError,
                }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateAdministratorPasswordDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            newAdministratorPassword: Joi.string()
                .regex(strongPasswordRegex)
                .trim().required()
                .messages({
                    "string.pattern.base": stringPasswordError,
                }),
            oldAdministratorPassword: Joi.string()
                .regex(strongPasswordRegex)
                .trim().required()
                .messages({
                    "string.pattern.base": stringPasswordError,
                }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static adminSigninDto = (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
            password: Joi.string()
                .regex(strongPasswordRegex)
                .required()
                .messages({
                    "string.empty": "Password is required",
                    "string.pattern.base": stringPasswordError,
                })
        });

        Validator.validateRequest(req, next, schema);
    };

    static getSingleAdminDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static superAdminChoicesDto = (req, res, next) => {
        const schema = Joi.object({
            Authenticator2FA: Joi.boolean().required(),
            securityQuestion: Joi.boolean().required(),
            setForAll: Joi.boolean().required(),
            isEnabled: Joi.boolean().optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateSuperAdminChoicesEnabledDto = (req, res, next) => {
        const schema = Joi.object({
            isEnabled: Joi.boolean().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static forgotPasswordDto = (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };
}

export default AdminDto;

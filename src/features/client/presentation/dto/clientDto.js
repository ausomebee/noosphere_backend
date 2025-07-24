import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";

class ClientDto {
    static createClientDto = (req, res, next) => {
        const schema = Joi.object({
            fullName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "string.min": "First name must be at least 3 characters",
                    "string.max": "First name must not exceed 20 characters",
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
            streetAddress: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            zipCode: Joi.string().required(),
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
            stage: Joi.string().trim().required(),
            gender: Joi.string()
                .required()
                .valid("male", "female", "other")
                .messages({
                    "string.empty": "Gender is required",
                    "any.only": "Gender must be 'male', 'female', or 'other'",
                }),
            DOB: Joi.date().required(),
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
            assignToTenantStaff: Joi.string().uuid().required().messages({
                "string.empty": "tenant staff ID is required",
                "string.guid": "tenant staff ID must be a valid UUID",
            }),
            dbAccess: Joi.boolean().required(),
            createdBy: Joi.string().uuid().required().messages({
                "string.empty": "Created by is required",
                "string.guid": "Created by must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static clientSigninDto = (req, res, next) => {
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

    static updateClientDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required(),
            email: Joi.string().email().optional(),
            phoneNumber: Joi.string().optional(),
            fullName: Joi.string().optional(),
            isDeleted: Joi.boolean().optional(),
            DOB: Joi.date().iso().optional(),
            gender: Joi.string().optional(),
            streetAddress: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            country: Joi.string().optional(),
            zipCode: Joi.string().optional(),
            password: Joi.string().min(6).optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientDto;
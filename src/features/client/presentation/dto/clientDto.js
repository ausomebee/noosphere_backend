import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";

class ClientDto {
    static createClientDto = (req, res, next) => {
        const schema = Joi.object({
            firstName: Joi.string()
                .required()
                .min(2)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "any.required": "First name is required"
                }),

            lastName: Joi.string()
                .required()
                .min(2)
                .trim()
                .messages({
                    "string.empty": "Last name is required",
                    "any.required": "Last name is required"
                }),

            preferredName: Joi.string().optional().trim(),

            email: Joi.string()
                .email()
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is required"
                }),

            phoneNumber: Joi.string()
                .required()
                .min(8)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Phone number is required",
                    "string.min": "Phone number must be at least 8 characters",
                    "string.max": "Phone number must not exceed 20 characters"
                }),

            gender: Joi.string()
                .valid("male", "female", "other")
                .required()
                .messages({
                    "string.empty": "Gender is required",
                    "any.only": "Gender must be 'male', 'female', or 'other'"
                }),

            DOB: Joi.date()
                .optional()
                .messages({
                    "date.base": "DOB must be a valid date (YYYY-MM-DD)"
                }),

            primaryPayer: Joi.string().optional().trim(),

            streetAddress: Joi.string().optional().trim(),
            city: Joi.string().optional().trim(),
            state: Joi.string().optional().trim(),
            country: Joi.string().optional().trim(),
            zipCode: Joi.string().optional().trim(),

            tenantId: Joi.string()
                .uuid()
                .required()
                .messages({
                    "string.empty": "Tenant ID is required",
                    "string.guid": "Tenant ID must be a valid UUID"
                }),

            pipelineStageId: Joi.string()
                .uuid()
                .required()
                .messages({
                    "string.empty": "Pipeline stage ID is required",
                    "string.guid": "Pipeline stage ID must be a valid UUID"
                }),

            assignToClinician: Joi.string()
                .uuid()
                .optional()
                .messages({
                    "string.guid": "Clinician ID must be a valid UUID"
                }),

            clientPortalAccess: Joi.boolean()
                .optional()
                .default(false),

            caregiverName: Joi.string().optional().trim(),
            caregiverRelationship: Joi.string().optional().trim(),
            caregiverPhone: Joi.string().optional().trim(),

            caregiverEmail: Joi.string()
                .email()
                .optional()
                .messages({
                    "string.email": "Caregiver email must be valid"
                }),

            caregiverStreetAddress: Joi.string().optional().trim(),
            caregiverCity: Joi.string().optional().trim(),
            caregiverState: Joi.string().optional().trim(),
            caregiverCountry: Joi.string().optional().trim(),
            caregiverZip: Joi.string().optional().trim(),

            documents: Joi.array()
                .items(Joi.object().unknown(true))
                .optional(),
            stage: Joi.string().optional().trim(),
            createdBy: Joi.string()
                .uuid()
                .optional()

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
            firstName: Joi.string()
                .required()
                .min(2)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "any.required": "First name is required"
                }),

            lastName: Joi.string()
                .required()
                .min(2)
                .trim()
                .messages({
                    "string.empty": "Last name is required",
                    "any.required": "Last name is required"
                }),

            preferredName: Joi.string().optional().trim(),

            email: Joi.string()
                .email()
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is required"
                }),

            phoneNumber: Joi.string()
                .required()
                .min(8)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Phone number is required",
                    "string.min": "Phone number must be at least 8 characters",
                    "string.max": "Phone number must not exceed 20 characters"
                }),

            gender: Joi.string()
                .valid("male", "female", "other")
                .required()
                .messages({
                    "string.empty": "Gender is required",
                    "any.only": "Gender must be 'male', 'female', or 'other'"
                }),

            DOB: Joi.date()
                .optional()
                .messages({
                    "date.base": "DOB must be a valid date (YYYY-MM-DD)"
                }),

            primaryPayer: Joi.string().optional().trim(),

            streetAddress: Joi.string().optional().trim(),
            city: Joi.string().optional().trim(),
            state: Joi.string().optional().trim(),
            country: Joi.string().optional().trim(),
            zipCode: Joi.string().optional().trim(),

            tenantId: Joi.string()
                .uuid()
                .required()
                .messages({
                    "string.empty": "Tenant ID is required",
                    "string.guid": "Tenant ID must be a valid UUID"
                }),

            pipelineStageId: Joi.string()
                .uuid()
                .required()
                .messages({
                    "string.empty": "Pipeline stage ID is required",
                    "string.guid": "Pipeline stage ID must be a valid UUID"
                }),

            assignToClinician: Joi.string()
                .uuid()
                .optional()
                .messages({
                    "string.guid": "Clinician ID must be a valid UUID"
                }),

            clientPortalAccess: Joi.boolean()
                .optional()
                .default(false),

            caregiverName: Joi.string().optional().trim(),
            caregiverRelationship: Joi.string().optional().trim(),
            caregiverPhone: Joi.string().optional().trim(),

            caregiverEmail: Joi.string()
                .email()
                .optional()
                .messages({
                    "string.email": "Caregiver email must be valid"
                }),

            caregiverStreetAddress: Joi.string().optional().trim(),
            caregiverCity: Joi.string().optional().trim(),
            caregiverState: Joi.string().optional().trim(),
            caregiverCountry: Joi.string().optional().trim(),
            caregiverZip: Joi.string().optional().trim(),

            documents: Joi.array()
                .items(Joi.object().unknown(true))
                .optional()
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientDto;
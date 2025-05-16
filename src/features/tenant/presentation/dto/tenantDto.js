import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";

class TenantDto {
    static createCandidateDto = (req, res, next) => {
        const schema = Joi.object({
            fullName: Joi.string()
                .required()
                .min(3)
                .max(50)
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
            companyName: Joi.string().trim().required(),
            contactPerson: Joi.string().trim().required(),
            companySize: Joi.string().trim().required(),
            organizationType: Joi.string().trim().required(),
            location: Joi.object(),
            leadSource: Joi.string().trim().required(),
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
            assignToAdmin: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
            createdBy: Joi.string().uuid().required().messages({
                "string.empty": "created by ID is required",
                "string.guid": "created by ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTenantDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
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
            active: Joi.boolean()
                .messages({
                    "boolean.base": "Active status must be a boolean value",
                }),
            isDeleted: Joi.boolean()
                .messages({
                    "boolean.base": "Deleted status must be a boolean value",
                }),
            companyName: Joi.string()
                .required()
                .trim()
                .max(255)
                .messages({
                    "string.empty": "Company name is required",
                    "string.max": "Company name must not exceed 255 characters",
                }),
            contactPerson: Joi.string()
                .required()
                .trim()
                .max(255)
                .messages({
                    "string.empty": "Contact person is required",
                    "string.max": "Contact person must not exceed 255 characters",
                }),
            companySize: Joi.string()
                .trim()
                .messages({
                    "string.empty": "Company size is required",
                }),
            organizationType: Joi.string()
                .trim()
                .messages({
                    "string.empty": "Organization type is required",
                }),
            location: Joi.object(),
            leadSource: Joi.string()
                .required()
                .trim()
                .messages({
                    "string.empty": "Lead source is required",
                }),
            stage: Joi.string()
                .required()
                .trim()
                .messages({
                    "string.empty": "Stage is required",
                }),
        });

        Validator.validateRequest(req, next, schema);
    };


    // static createTenantStaffDto = (req, res, next) => {
    //     const schema = Joi.object({
    //         fullName: Joi.string()
    //             .required()
    //             .min(3)
    //             .max(20)
    //             .trim()
    //             .messages({
    //                 "string.empty": "First name is required",
    //                 "string.min": "First name must be at least 3 characters",
    //                 "string.max": "First name must not exceed 20 characters",
    //             }),
    //         email: Joi.string()
    //             .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    //             .required()
    //             .trim()
    //             .lowercase()
    //             .messages({
    //                 "string.email": "Email must be a valid email",
    //                 "string.empty": "Email is required",
    //                 "any.required": "Email is a required field",
    //             }),
    //         password: Joi.string()
    //             .regex(strongPasswordRegex)
    //             .required()
    //             .messages({
    //                 "string.empty": "Password is required",
    //                 "string.pattern.base": stringPasswordError,
    //             }),
    //         phoneNumber: Joi.string()
    //             .required()
    //             .trim()
    //             .min(10)
    //             .max(15)
    //             .messages({
    //                 "string.empty": "Phone number is required",
    //                 "string.min": "Phone number must be at least 10 characters long",
    //                 "string.max": "Phone number must be at most 15 characters long"
    //             }),
    //         stage: Joi.string().trim().required(),
    //         roleId: Joi.string().uuid().required().messages({
    //             "string.empty": "Role ID is required",
    //             "string.guid": "Role ID must be a valid UUID",
    //         }),
    //         tenantId: Joi.string().uuid().required().messages({
    //             "string.empty": "Tenant ID is required",
    //             "string.guid": "Tenant ID must be a valid UUID",
    //         })
    //     });

    //     Validator.validateRequest(req, next, schema);
    // };

    // static staffSigninDto = (req, res, next) => {
    //     const schema = Joi.object({
    //         email: Joi.string()
    //             .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    //             .required()
    //             .trim()
    //             .lowercase()
    //             .messages({
    //                 "string.email": "Email must be a valid email",
    //                 "string.empty": "Email is required",
    //                 "any.required": "Email is a required field",
    //             }),
    //         password: Joi.string()
    //             .regex(strongPasswordRegex)
    //             .required()
    //             .messages({
    //                 "string.empty": "Password is required",
    //                 "string.pattern.base": stringPasswordError,
    //             })
    //     });

    //     Validator.validateRequest(req, next, schema);
    // };

    // static getSingleStaffDto = (req, res, next) => {
    //     const schema = Joi.object({
    //         id: Joi.string().uuid().required().messages({
    //             "string.empty": "ID is required",
    //             "string.guid": "ID must be a valid UUID",
    //         }),
    //     });

    //     Validator.validateRequest(req, next, schema, req.params);
    // };
}

export default TenantDto;
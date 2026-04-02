import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class IssueDto {
    static createIssueDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required().messages({
                'string.empty': 'Tenant ID is required',
                'string.guid': 'Tenant ID must be a valid UUID'
            }),
            title: Joi.string().required().messages({
                'string.empty': 'Title is required'
            }),
            description: Joi.string().required().messages({
                'string.empty': 'Description is required'
            }),
            category: Joi.string().required().messages({
                'string.empty': 'Category is required'
            }),
            priority: Joi.string().valid('P1', 'P2', 'P3', 'P4', 'EP1', 'EP2').optional().messages({
                'any.only': 'Priority must be one of P1, P2, P3, P4, EP1, or EP2',
                'string.empty': 'Priority is required'
            }),
            adminId: Joi.string().uuid().optional().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            resolutionDeadline: Joi.date().optional().messages({
                'date.base': 'Resolution deadline must be a valid date',
                'any.required': 'Resolution deadline is required'
            }),
            adminLoggedById: Joi.string().uuid().optional().messages({
                'string.guid': 'Tenant staff ID must be a valid UUID'
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static checkBodyIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static checkStatusDto = (req, res, next) => {
        const schema = Joi.object({
            status: Joi.string().valid("all", "Resolved", "In Progress", "Not Started", "Unassigned"),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static createIssueCommentDto = (req, res, next) => {
        const schema = Joi.object({
            issueId: Joi.string().uuid().required().messages({
                'string.base': 'Issue ID must be a string',
                'string.empty': 'Issue ID is required',
                'string.guid': 'Issue ID must be a valid UUID',
                'any.required': 'Issue ID is required'
            }),
            comment: Joi.string().required().messages({
                'string.base': 'Comment must be a string',
                'string.empty': 'Comment is required',
                'any.required': 'Comment is required'
            }),
            adminId: Joi.string().uuid().required().messages({
                'string.base': 'Admin ID must be a string',
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID',
                'any.required': 'Admin ID is required'
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static editIssueDto = (req, res, next) => {
        const schema = Joi.object({
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            title: Joi.string().required().messages({
                'string.empty': 'Title is required'
            }),
            description: Joi.string().required().messages({
                'string.empty': 'Description is required'
            }),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static changeCategoryDto = (req, res, next) => {
        const schema = Joi.object({
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            category: Joi.string().required().messages({
                'string.empty': 'Category is required'
            }),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static changePriorityDto = (req, res, next) => {
        const schema = Joi.object({
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            priority: Joi.string().valid('P1', 'P2', 'P3', 'P4', 'EP1', 'EP2').required().messages({
                'any.only': 'Priority must be one of P1, P2, P3, P4, EP1, or EP2',
                'string.empty': 'Priority is required'
            }),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static reassignIssueDto = (req, res, next) => {
        const schema = Joi.object({
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            adminId: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static changeStatusDto = (req, res, next) => {
        const schema = Joi.object({
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            status: Joi.string().valid("all", "Resolved", "In Progress", "Not Started", "Unassigned"),
        });

        Validator.validateRequest(req, next, schema);
    };

    static markRessolvedDto = (req, res, next) => {
        const schema = Joi.object({
            updatedBy: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID"
            }),
            status: Joi.string().valid("Resolved").default("Resolved"),
            resolutionDescription: Joi.string().required()
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default IssueDto;
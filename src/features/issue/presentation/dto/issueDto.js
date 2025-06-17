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
            priority: Joi.string().valid('P1', 'P2', 'P3', 'P4', 'EP1', 'EP2').required().messages({
                'any.only': 'Priority must be one of P1, P2, P3, P4, EP1, or EP2',
                'string.empty': 'Priority is required'
            }),
            adminId: Joi.string().uuid().required().messages({
                'string.empty': 'Admin ID is required',
                'string.guid': 'Admin ID must be a valid UUID'
            }),
            resolutionDeadline: Joi.date().required().messages({
                'date.base': 'Resolution deadline must be a valid date',
                'any.required': 'Resolution deadline is required'
            }),
            tenantStaffId: Joi.string().uuid().optional().messages({
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
    
}

export default IssueDto;
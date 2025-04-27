import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class PipelineDto {
    static tenantPipelineDto = (req, res, next) => {
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
                "string.empty": "ADMIN ID is required",
                "string.guid": "ADMIN ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static internalPipelineDto = (req, res, next) => {
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
            createdByTenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static pipelineStageDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .required()
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            pipelineId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline ID is required",
                "string.guid": "Pipeline ID must be a valid UUID",
            }),
            tasks: Joi.object().optional(),
            order: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static pipelineItemDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string().uuid().allow('').optional().messages({
                "string.guid": "Client ID must be a valid UUID",
            }),
            tenantId: Joi.string().uuid().allow('').optional().messages({
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
            doneTasks: Joi.object().optional(),
        });

        Validator.validateRequest(req, next, schema);
    };

}

export default PipelineDto;
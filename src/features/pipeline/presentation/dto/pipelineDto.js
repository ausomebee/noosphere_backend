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
            description: Joi.string().trim().optional(),
            createdByAdminId: Joi.string().uuid().required().messages({
                "string.empty": "ADMIN ID is required",
                "string.guid": "ADMIN ID must be a valid UUID",
            }),
            module: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static clientPipelineDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .required()
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            description: Joi.string().trim().optional(),
            createdByTenantId: Joi.string().uuid().required().messages({
                "string.empty": "TENANT ID is required",
                "string.guid": "TENANT ID must be a valid UUID",
            }),
            module: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static getPipelinesByTenantIdDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "TENANT ID is required",
                "string.guid": "TENANT ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static getPipelinesByModuleDto = (req, res, next) => {
        const schema = Joi.object({
            module: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static updateActivityDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            isActive: Joi.boolean().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createStageDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string()
                .required()
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            description: Joi.string().trim().optional(),
            pipelineId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline ID is required",
                "string.guid": "Pipeline ID must be a valid UUID",
            }),
            colourCode: Joi.string().trim().required(),
            tasks: Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().required().messages({
                        'string.base': 'Task name must be a string',
                        'string.empty': 'Task name is required'
                    }),
                    required: Joi.boolean().required().messages({
                        'boolean.base': 'Required must be a boolean',
                        'any.required': 'Required field is required'
                    })
                })
            ),
            documents: Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().required().messages({
                        'string.base': 'Document name must be a string',
                        'string.empty': 'Document name is required'
                    }),
                    required: Joi.boolean().required().messages({
                        'boolean.base': 'Required must be a boolean',
                        'any.required': 'Required field is required'
                    })
                })
            )
        });

        Validator.validateRequest(req, next, schema);
    };

    static getStagesByPipelineIdDto = (req, res, next) => {
        const schema = Joi.object({
            pipelineId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline ID is required",
                "string.guid": "Pipeline ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static getByIdDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static createTenantPipelineItemDto = (req, res, next) => {
        const schema = Joi.object({
            tenantId: Joi.string().uuid().required().messages({
                "string.empty": "Tenant ID is required",
                "string.guid": "Tenant ID must be a valid UUID",
            }),
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
            assignToStaff: Joi.string().uuid().required().messages({
                "string.empty": "Staff ID is required",
                "string.guid": "Staff ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static createClientPipelineItemDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string().uuid().required().messages({
                "string.empty": "Client ID is required",
                "string.guid": "Client ID must be a valid UUID",
            }),
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
            assignToStaff: Joi.string().uuid().required().messages({
                "string.empty": "Staff ID is required",
                "string.guid": "Staff ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static getItemByStageIdDto = (req, res, next) => {
        const schema = Joi.object({
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };

    static updateItemStageDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            pipelineStageId: Joi.string().uuid().required().messages({
                "string.empty": "Pipeline stage ID is required",
                "string.guid": "Pipeline stage ID must be a valid UUID",
            })
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateStageOrderDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            order: Joi.number().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateStageDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            name: Joi.string()
                .required()
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Name is required",
                    "string.max": "Name must not exceed 20 characters",
                }),
            description: Joi.string().trim().optional(),
            colourCode: Joi.string().trim().required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateTasksDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            tasks: Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().required().messages({
                        'string.base': 'Task name must be a string',
                        'string.empty': 'Task name is required'
                    }),
                    required: Joi.boolean().required().messages({
                        'boolean.base': 'Required must be a boolean',
                        'any.required': 'Required field is required'
                    })
                })
            )
        });

        Validator.validateRequest(req, next, schema);
    };

    static updateDocumentsDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            documents: Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().required().messages({
                        'string.base': 'Document name must be a string',
                        'string.empty': 'Document name is required'
                    }),
                    required: Joi.boolean().required().messages({
                        'boolean.base': 'Required must be a boolean',
                        'any.required': 'Required field is required'
                    })
                })
            )
        });

        Validator.validateRequest(req, next, schema);
    };

    static assignCandidateDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
            assignToStaff: Joi.string().uuid().required().messages({
                "string.empty": "Staff ID is required",
                "string.guid": "Staff ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema);
    };

    static deleteTenantPipelineItemDto = (req, res, next) => {
        const schema = Joi.object({
            id: Joi.string().uuid().required().messages({
                "string.empty": "ID is required",
                "string.guid": "ID must be a valid UUID",
            }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    };
}

export default PipelineDto;    
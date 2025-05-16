import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class FeatureDto {
    static createFeatureDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
            description: Joi.string().trim().required(),
            featureGroupId: Joi.string().trim().required(),
            applicablePlans: Joi.array().items(Joi.string().trim()).required()
        });

        Validator.validateRequest(req, next, schema);
    };

    static createFeatureGroupDto = (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
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

export default FeatureDto;
import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class TargetDataDto {
    static createTargetDataDto = (req, res, next) => {
        const schema = Joi.object({
            clientTargetId: Joi.string().uuid().required(),
            data: Joi.object().required().max(5000)
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default TargetDataDto;
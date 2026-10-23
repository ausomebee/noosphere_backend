import Joi from "joi";
import Validator from "../../../../utilities/validate.js";

class ClientTargetDto {
    static createClientTargetDto = (req, res, next) => {
        const schema = Joi.object({
            clientId: Joi.string().uuid().required(),
            targetId: Joi.string().uuid().required(),
            programId: Joi.string().uuid().optional(),
        });

        Validator.validateRequest(req, next, schema);
    };
}

export default ClientTargetDto;
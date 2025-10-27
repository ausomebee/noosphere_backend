class FormResponseFieldService {
    constructor({ formResponseFieldRepository }) {
        this.formResponseFieldRepository = formResponseFieldRepository;
    }

    async createFormResponseField(data) {
        const newField = await this.formResponseFieldRepository.create(data);

        if (!newField) {
            throw new Error("Failed to create Form Response Field");
        }

        return newField;
    }

    async updateFormResponseField(data) {
        const field = await this.formResponseFieldRepository.findOne({ id: data.id });

        if (!field) {
            throw new Error("Form Response Field not found");
        }

        const update = await this.formResponseFieldRepository.update(data.id, {
            responseId: data.responseId || field.responseId,
            fieldId: data.fieldId || field.fieldId,
            value: data.value || field.value,
        });

        if (!update) {
            throw new Error("Failed to update Form Response Field");
        }

        return update;
    }

    async getSingleFormResponseField(data) {
        const field = await this.formResponseFieldRepository.findOne({ id: data.id });

        if (!field) {
            throw new Error("Form Response Field not found");
        }

        return field;
    }

    async getResponseFieldsByResponseId(responseId) {
        const fields = await this.formResponseFieldRepository.findAll({ responseId });

        if (!fields) {
            throw new Error("Form Response Fields not found");
        }

        return fields;
    }
}

export default FormResponseFieldService;

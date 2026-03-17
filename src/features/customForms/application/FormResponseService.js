class FormResponseService {
    constructor({ formResponseRepository }) {
        this.formResponseRepository = formResponseRepository;
    }

    async createFormResponse(data) {
        const newResponse = await this.formResponseRepository.create(data);

        if (!newResponse) {
            throw new Error("Failed to create Form Response");
        }

        return newResponse;
    }

    async updateFormResponse(data) {
        const formResponse = await this.formResponseRepository.findOne({ id: data.id });

        if (!formResponse) {
            throw new Error("Form Response not found");
        }

        const update = await this.formResponseRepository.update(data.id, {
            formId: data.formId || formResponse.formId,
            tenantId: data.tenantId || formResponse.tenantId,
        });

        if (!update) {
            throw new Error("Failed to update Form Response");
        }

        return update;
    }

    async getSingleFormResponse(data) {
        const formResponse = await this.formResponseRepository.findOne({ id: data.id });

        if (!formResponse) {
            throw new Error("Form Response not found");
        }

        return formResponse;
    }

    async getFormResponses(formId) {
        const responses = await this.formResponseRepository.findAllAndPopulate({ formId }, { fields: true, form: true });

        if (!responses || responses.length === 0) {
            throw new Error("No Form Responses found");
        }

        return responses;
    }
}

export default FormResponseService;

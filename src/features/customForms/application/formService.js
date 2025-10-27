class FormService {
    constructor({ formRepository }) {
        this.formRepository = formRepository;
    }

    async createForm(data) {
        const formExists = await this.formRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (formExists) {
            throw new Error("This form already exists.");
        }

        const newForm = await this.formRepository.create(data);

        if (!newForm) {
            throw new Error("Failed to create Form");
        }

        return newForm;
    }

    async updateForm(data) {
        const form = await this.formRepository.findOne({ id: data.id });

        if (!form) {
            throw new Error("Form not found");
        }

        const update = await this.formRepository.update(data.id, {
            name: data.name || form.name,
            tenantId: data.tenantId || form.tenantId,
        });

        if (!update) {
            throw new Error("Failed to update Form");
        }

        return update;
    }

    async getSingleForm(data) {
        const form = await this.formRepository.findOne({ id: data.id });

        if (!form) {
            throw new Error("Form not found");
        }

        return form;
    }

    async getTenantForms(tenantId) {
        const forms = await this.formRepository.findAll({ tenantId });

        if (!forms) {
            throw new Error("Forms not found");
        }

        return forms;
    }
}

export default FormService;

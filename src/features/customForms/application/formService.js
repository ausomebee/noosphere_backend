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
            isDraft: data.isDraft ?? form.isDraft,
            isTemplate: data.isTemplate ?? form.isTemplate
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
        const forms = await this.formRepository.findAll({
            AND: [
                { tenantId: tenantId },
                { isDraft: false },
                { isTemplate: false }
            ]
        });

        return forms ?? [];
    }

    async getTenantDrafts(tenantId) {
        const forms = await this.formRepository.findAll({
            AND: [
                { tenantId: tenantId },
                { isDraft: true }
            ]
        });

        return forms ?? [];
    }

    async getTenantTemplates(tenantId) {
        const forms = await this.formRepository.findAll({
            AND: [
                { tenantId: tenantId },
                { isTemplate: true }
            ]
        });

        return forms ?? [];
    }
}

export default FormService;

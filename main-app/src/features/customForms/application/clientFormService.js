class ClientFormService {
    constructor({ clientFormRepository }) {
        this.clientFormRepository = clientFormRepository;
    }

    async createClientForm(data) {
        const clientFormExists = await this.clientFormRepository.findFirst({
            AND: [
                { tenantClientId: data.tenantClientId },
                { formId: data.formId },
            ]
        });

        if (clientFormExists) {
            throw new Error("This ClientForm already exists.");
        }

        const newClientForm = await this.clientFormRepository.create(data);

        if (!newClientForm) {
            throw new Error("Failed to create ClientForm");
        }

        return newClientForm;
    }

    async updateClientForm(data) {
        const existingForm = await this.clientFormRepository.findFirst({ formId: data.formId , tenantClientId: data.tenantClientId });
        if (!existingForm) {
            throw new Error("ClientForm not found");
        }

        const updatedForm = await this.clientFormRepository.update(existingForm.id, {
            tenantClientId: data.tenantClientId || existingForm.tenantClientId,
            formId: data.formId || existingForm.formId,
            status: data.status || existingForm.status,
            dueDate: data.dueDate || existingForm.dueDate,
        });

        if (!updatedForm) {
            throw new Error("Failed to update ClientForm");
        }

        return updatedForm;
    }

    async getAllClientForms(tenantClientId) {
        const forms = await this.clientFormRepository.findAllAndPopulate(
            { tenantClientId },
            { form: true, client: true }
        );

        if (!forms) {
            throw new Error("Forms not found");
        }

        return forms;
    }

    async countAllClientFormsByStatus(tenantClientId) {
        return await this.clientFormRepository
            .countAllClientFormsByStatus(tenantClientId);
    }

}

export default ClientFormService;

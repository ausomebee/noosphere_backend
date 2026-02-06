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

     async countAllClientFormsByStatus() {
        const forms = await this.clientFormRepository.countAllClientFormsByStatus();

        if (!forms) {
            throw new Error("Document not found");
        }

        const overdue = await this.clientFormRepository.countAllClientFormsByDueDate();

        if (!overdue) {
            throw new Error("Document not found");
        }

        return forms;
    }
}

export default ClientFormService;

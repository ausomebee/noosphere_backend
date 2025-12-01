import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";

import ClientFormRepository from "../../infrastructure/clientFormRepository.js";
import ClientFormService from "../../application/clientFormService.js";
import ClientForm from "../../domain/clientForm.js";

class ClientFormController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.clientFormRepository = new ClientFormRepository(this.prisma.clientForm);
        this.service = new ClientFormService({ clientFormRepository: this.clientFormRepository });
    }

    createClientForm = expressAsyncHandler(async (req, res) => {
        const clientFormData = new ClientForm(req.body);

        const clientForm = await this.service.createClientForm(
            clientFormData.createClientForm
        );

        if (!clientForm) {
            return res.status(500).json({ message: "Failed to create client form" });
        }

        return res.status(201).json({
            message: "client form created successfully",
            status: "ok",
            data: clientForm,
        });
    });

    getClientForms = expressAsyncHandler(async (req, res) => {
        const forms = await this.service.getAllClientForms(req.params.tenantClientId);

        if (!forms) {
            return res.status(500).json({ message: "Failed to fetch client forms" });
        }

        return res.status(200).json({
            message: "client forms fetched successfully",
            status: "ok",
            data: forms,
        });
    });
}

export default ClientFormController;

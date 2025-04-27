import expressAsyncHandler from "express-async-handler";
import ClientService from "../../application/clientService.js";
import Client from "../../domain/client.js";

class ClientController {
    constructor() {
        this.service = new ClientService();
    }

    createClient = expressAsyncHandler(async (req, res) => {
        const clientData = new Client(req.body);
        const client = await this.service.createCient(clientData);

        if (!client) {
            res.status(500).json({ message: 'Failed to create client' });
        }

        return res.status(201).json({
            message: "Client created successfully",
            status: 'ok',
            data: client
        });
    });

    createClientTenant = expressAsyncHandler(async (req, res) => {
        const clientData = new Client(req.body);
        const client = await this.service.createClientTenant(clientData.createClientTenant);

        if (!client) {
            res.status(500).json({ message: 'Failed to create tenant client' });
        }

        return res.status(201).json({
            message: "Tenant client created successfully",
            status: 'ok',
            data: client
        });
    });

    clientSignin = expressAsyncHandler(async (req, res) => {
        const client = await this.service.clientSignin(req.body);

        if (!client) {
            res.status(500).json({ message: 'Failed to signin client' });
        }

        return res.status(201).json({
            message: "client login successfully",
            status: 'ok',
            data: client
        });
    });
}

export default ClientController;
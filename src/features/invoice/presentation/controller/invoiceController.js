import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import InvoiceRepository from "../../infrastructure/invoiceRepository.js";
import InvoiceService from "../../application/invoiceService.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";

class InvoiceController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.invoiceRepository = new InvoiceRepository(this.prisma.invoice);
        this.planRepository = new PlanRepository(this.prisma.billingPlan)
        this.service = new InvoiceService({ invoiceRepository: this.invoiceRepository, planRepository: this.planRepository });
    }

    createInvoice = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.createInvoice(req.body);

        if (!invoice) {
            res.status(500).json({ message: 'Failed to create invoice' });
        }

        return res.status(201).json({
            message: "Invoice created successfully",
            status: 'ok',
            data: invoice
        });
    });

    getSingleInvoice = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getSingleInvoice(req.params.id);

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoice' });
        }

        return res.status(201).json({
            message: "Invoice fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

    getAllInvoice = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getAllInvoice();

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoices' });
        }

        return res.status(201).json({
            message: "Invoices fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

    getTotalBilled = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getTotalBilled();

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoices' });
        }

        return res.status(201).json({
            message: "Invoices fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

    getTotalDueInvoice = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getTotalDueInvoice();

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoices' });
        }

        return res.status(201).json({
            message: "Invoices fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

    getAllInvoiceByStatus = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getAllInvoiceByStatus(req.params.status);

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoices' });
        }

        return res.status(201).json({
            message: "Invoices fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

}

export default InvoiceController;
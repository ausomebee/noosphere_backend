import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import InvoiceRepository from "../../infrastructure/invoiceRepository.js";
import InvoiceService from "../../application/invoiceService.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";
import InvoiceManagementRepository from "../../infrastructure/invoiceManagementRepository.js";

class InvoiceController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.invoiceRepository = new InvoiceRepository(this.prisma.invoice);
        this.invoiceManagementRepository = new InvoiceManagementRepository(this.prisma.invoiceManagement);
        this.planRepository = new PlanRepository(this.prisma.billingPlan)
        this.service = new InvoiceService({ invoiceRepository: this.invoiceRepository, planRepository: this.planRepository, invoiceManagementRepository: this.invoiceManagementRepository });
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

    getTenantInvoices = expressAsyncHandler(async (req, res) => {
        const tenantId = req.params.tenantId;

        const invoices = await this.service.getTenantInvoices(tenantId);

        return res.status(200).json({
            message: "Tenant invoices fetched successfully",
            status: "ok",
            data: invoices,
        });
    });

    getTenantInvoicesByStatus = expressAsyncHandler(async (req, res) => {
        const { status, tenantId } = req.params;

        const invoices = await this.service.getTenantInvoicesByStatus(
            tenantId,
            status
        );

        return res.status(200).json({
            message: `Invoices with status ${status} fetched successfully`,
            status: "ok",
            data: invoices,
        });
    });

    getTotalBilled = expressAsyncHandler(async (req, res) => {
        const params = req.params.from === "all" ? null : req.params
        const invoice = await this.service.getTotalBilled(params);

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
        const params = req.params.from === "all" ? null : req.params
        const invoice = await this.service.getTotalDueInvoice(params);

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
        const params = req.params.status === "all" ? null : req.params.status
        const invoice = await this.service.getAllInvoiceByStatus(params);

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoices' });
        }

        return res.status(201).json({
            message: "Invoices fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

    getTotalByStatus = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getTotalByStatus();

        if (!invoice) {
            res.status(500).json({ message: 'Failed to count invoices' });
        }

        return res.status(201).json({
            message: "Invoices counted successfully",
            status: 'ok',
            data: invoice
        });
    });

    createInvoiceManagement = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.createInvoiceManagement(req.body);

        if (!invoice) {
            res.status(500).json({ message: 'Failed to create invoice management' });
        }

        return res.status(201).json({
            message: "Invoice management created successfully",
            status: 'ok',
            data: invoice
        });
    });

    getInvoiceManagement = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.getInvoiceManagement();

        if (!invoice) {
            res.status(500).json({ message: 'Failed to fetch invoice management' });
        }

        return res.status(201).json({
            message: "Invoice management fetched successfully",
            status: 'ok',
            data: invoice
        });
    });

    updateInvoiceManagement = expressAsyncHandler(async (req, res) => {
        const invoice = await this.service.updateInvoiceManagement(req.body);

        if (!invoice) {
            res.status(500).json({ message: 'Failed to update invoice management' });
        }

        return res.status(201).json({
            message: "Invoice management updated successfully",
            status: 'ok',
            data: invoice
        });
    });
}

export default InvoiceController;
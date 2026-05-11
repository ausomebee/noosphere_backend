import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import InvoiceRepository from "../../infrastructure/invoiceRepository.js";
import InvoiceService from "../../application/invoiceService.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";
import InvoiceManagementRepository from "../../infrastructure/invoiceManagementRepository.js";
import InvoiceTokenRepository from "../../infrastructure/invoiceTokenRepository.js";
import TenantRepository from "../../../tenant/infrastructure/tenantRepository.js";

class InvoiceController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.invoiceRepository = new InvoiceRepository(this.prisma.invoice);
        this.invoiceManagementRepository = new InvoiceManagementRepository(this.prisma.invoiceManagement);
        this.invoiceTokenRepository = new InvoiceTokenRepository(this.prisma.invoiceToken);
        this.planRepository = new PlanRepository(this.prisma.billingPlan);
        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.service = new InvoiceService({ invoiceRepository: this.invoiceRepository, planRepository: this.planRepository, invoiceManagementRepository: this.invoiceManagementRepository, invoiceTokenRepository: this.invoiceTokenRepository, tenantRepository: this.tenantRepository });
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

    validatePaymentToken = expressAsyncHandler(async (req, res) => {
        const token = req.params.token;

        const invoice = await this.service.validatePaymentToken(token);
        if (!invoice) {
            res.status(500).json({ message: 'Failed to validate payment token' });
        }

        return res.status(201).json({
            message: "Payment token validated successfully",
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

    generatePaymentLink = expressAsyncHandler(async (req, res) => {
        const paymentLink = await this.service.generatePaymentLink(req.body);

        if (!paymentLink) {
            res.status(500).json({ message: 'Failed to generate payment link' });
        }

        return res.status(201).json({
            message: "Payment link generated successfully",
            status: 'ok',
            data: paymentLink
        });
    });

    regeneratePaymentLink = expressAsyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const paymentLink = await this.service.regeneratePaymentLink(tenantId);

        if (!paymentLink) {
            res.status(500).json({ message: 'Failed to regenerate payment link' });
        }

        return res.status(201).json({
            message: "Payment link regenerated successfully",
            status: 'ok',
            data: paymentLink
        });
    });

    getInvoiceTokenHistory = expressAsyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const history = await this.service.getInvoiceTokenHistory(tenantId);

        if (!history) {
            res.status(500).json({ message: 'Failed to fetch invoice token history' });
        }

        return res.status(201).json({
            message: "Invoice token history fetched successfully",
            status: 'ok',
            data: history
        });
    });

    getTenantInvoices = expressAsyncHandler(async (req, res) => {
        const tenantId = req.params.tenantId;
        const { page = 1, pageSize = 10 } = req.query;

        const invoices = await this.service.getTenantInvoices(
            tenantId,
            {},
            Number(page),
            Number(pageSize)
        );

        return res.status(200).json({
            message: "Tenant invoices fetched successfully",
            status: "ok",
            data: invoices.data,
            pagination: invoices.pagination,
        });
    });

     getAllInvoices = expressAsyncHandler(async (req, res) => {
        const { page = 1, pageSize = 10 } = req.query;

        const invoices = await this.service.getAllInvoices(
            Number(page),
            Number(pageSize)
        );

        return res.status(200).json({
            message: "Invoices fetched successfully",
            status: "ok",
            data: invoices.data,
            pagination: invoices.pagination,
        });
    });

    getTenantInvoicesByStatus = expressAsyncHandler(async (req, res) => {
        const { status, tenantId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const invoices = await this.service.getTenantInvoicesByStatus(
            tenantId,
            status,
            page,
            pageSize
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
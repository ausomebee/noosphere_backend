import expressAsyncHandler from "express-async-handler";
import BillingService from "../../application/billingService.js";
import Billing from "../../domain/billing.js";
import prismaService from "../../../../config/prisma.js";
import TransactionRepository from "../../infrastructure/transactionsRepository.js";
import BillingRepository from "../../infrastructure/billingRepository.js";
import PaymentRepository from "../../infrastructure/paymentRepository.js";
import PaymentMethodRepository from "../../infrastructure/paymentMethodRepository.js";
import InvoiceRepository from "../../../invoice/infrastructure/invoiceRepository.js";
import InvoiceService from "../../../invoice/application/invoiceService.js";
import SubscriptionRepository from "../../../planAndFeature/infrastructure/subscriptionRepository.js";
import SubscriptionService from "../../../planAndFeature/application/subscriptionService.js";
import Subscription from "../../../planAndFeature/domain/subscription.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";
import PlanService from "../../../planAndFeature/application/planService.js";
import InvoiceTokenRepository from "../../../invoice/infrastructure/invoiceTokenRepository.js";
import TenantRepository from "../../../tenant/infrastructure/tenantRepository.js";
import TenantService from "../../../tenant/application/tenantService.js";
import AdminService from "../../../admin/application/adminService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import MailService from "../../../../utilities/nodemailer.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
import SocketService from "../../../../config/socket.js";

class BillingController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.transactionsRepository = new TransactionRepository(this.prisma.transactions);
        this.billingRepository = new BillingRepository(this.prisma.billingMetadata);
        this.paymentRepository = new PaymentRepository(this.prisma.payment);
        this.paymentAccessRepository = new PaymentRepository(this.prisma.paymentAndAccountAccess);
        this.paymentMethodRepository = new PaymentMethodRepository(this.prisma.paymentMethod);
        this.service = new BillingService({
            transactionsRepository: this.transactionsRepository,
            billingRepository: this.billingRepository,
            paymentRepository: this.paymentRepository,
            paymentMethodRepository: this.paymentMethodRepository,
            paymentAccessRepository: this.paymentAccessRepository
        });

        this.invoiceTokenRepository = new InvoiceTokenRepository(this.prisma.invoiceToken);
        this.invoiceRepository = new InvoiceRepository(this.prisma.invoice);
        this.invoiceService = new InvoiceService({ invoiceRepository: this.invoiceRepository, invoiceTokenRepository: this.invoiceTokenRepository });

        this.subscriptionRepository = new SubscriptionRepository(this.prisma.subscription);
        this.subscriptionService = new SubscriptionService({ subscriptionRepository: this.subscriptionRepository });

        this.planRepository = new PlanRepository(this.prisma.billingPlan);
        this.planService = new PlanService({ planRepository: this.planRepository, adminRepository: null });

        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.tenantService = new TenantService({
            tenantRepository: this.tenantRepository,
        });

        this.adminService = new AdminService();

        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
    }

    createBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billingData = new Billing(req.body);
        const billing = await this.service.createBillingMetadata(billingData.createBillingMetadata);

        if (!billing) {
            res.status(500).json({ message: 'Failed to create Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata created successfully",
            status: 'ok',
            data: billing
        });
    });

    getTenantPayments = expressAsyncHandler(async (req, res) => {
        const tenantId = req.params.tenantId;
        const { page = 1, pageSize = 10 } = req.query;

        const payments = await this.service.getTenantPayments(
            tenantId,
            {},
            Number(page),
            Number(pageSize)
        );

        return res.status(200).json({
            message: "Tenant payments fetched successfully",
            status: "ok",
            data: payments.data,
            pagination: payments.pagination,
        });
    });

    getAllPayments = expressAsyncHandler(async (req, res) => {
        const { page = 1, pageSize = 10 } = req.query;

        const payments = await this.service.getAllPayments(
            Number(page),
            Number(pageSize)
        );

        return res.status(200).json({
            message: "payments fetched successfully",
            status: "ok",
            data: payments.data,
            pagination: payments.pagination,
        });
    });

    getTenantPaymentsByStatus = expressAsyncHandler(async (req, res) => {
        const { status, tenantId } = req.params;

        const payments = await this.service.getTenantPaymentsByStatus(
            tenantId,
            status
        );

        return res.status(200).json({
            message: `Payments with status ${status} fetched successfully`,
            status: "ok",
            data: payments,
        });
    });

    updateBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billing = await this.service.updateBillingMetadata(req.body);

        if (!billing) {
            res.status(500).json({ message: 'Failed to update Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata updated successfully",
            status: 'ok',
            data: billing
        });
    });

    getSingleBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billing = await this.service.getSingleBillingMetadata(req.params);

        if (!billing) {
            res.status(500).json({ message: 'Failed to fetch Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata fetched successfully",
            status: 'ok',
            data: billing
        });
    });

    getAllBillingMetadata = expressAsyncHandler(async (req, res) => {
        const billing = await this.service.getAllBillingMetadata();

        if (!billing) {
            res.status(500).json({ message: 'Failed to fetch Billing Metadata' });
        }

        return res.status(201).json({
            message: "Billing Metadata fetched successfully",
            status: 'ok',
            data: billing
        });
    });

    createTransaction = expressAsyncHandler(async (req, res) => {
        const transactionData = new Billing(req.body);
        const transaction = await this.service.createTransaction(transactionData.createTransaction);

        if (!transaction) {
            res.status(500).json({ message: 'Failed to create transaction' });
        }

        return res.status(201).json({
            message: "Transaction created successfully",
            status: 'ok',
            data: transaction
        });
    });

    getSingleTransaction = expressAsyncHandler(async (req, res) => {
        const transaction = await this.service.getSingleTransaction(req.params);

        if (!transaction) {
            res.status(500).json({ message: 'Failed to fetch transaction' });
        }

        return res.status(201).json({
            message: "Transaction fetched successfully",
            status: 'ok',
            data: transaction
        });
    });

    getAllTransaction = expressAsyncHandler(async (req, res) => {
        const transaction = await this.service.getAllTransaction();

        if (!transaction) {
            res.status(500).json({ message: 'Failed to fetch transactions' });
        }

        return res.status(201).json({
            message: "Transactions fetched successfully",
            status: 'ok',
            data: transaction
        });
    });

    createPayment = expressAsyncHandler(async (req, res) => {
        const paymentData = new Billing(req.body);
        const payment = await this.service.createPayment(paymentData.createPayment);

        if (!payment) {
            res.status(500).json({ message: 'Failed to create payment' });
        }

        return res.status(201).json({
            message: "Payment created successfully",
            status: 'ok',
            data: payment
        });
    });

    updatePayment = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.updatePayment(req.body);

        if (!payment) {
            res.status(500).json({ message: 'Failed to update payment' });
        }

        return res.status(201).json({
            message: "Payment updated successfully",
            status: 'ok',
            data: payment
        });
    });

    getSinglePayment = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getSinglePayment(req.params);

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment' });
        }

        return res.status(201).json({
            message: "Payment fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    getAllPayment = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getAllPayment();

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment' });
        }

        return res.status(201).json({
            message: "Payment fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    getTenantPaymentMethods = expressAsyncHandler(async (req, res) => {
        const paymentMethods = await this.service.getTenantPaymentMethods(req.params.tenantId);

        if (!paymentMethods) {
            res.status(500).json({ message: 'Failed to fetch payment methods' });
        }

        return res.status(201).json({
            message: "Payment methods fetched successfully",
            status: 'ok',
            data: paymentMethods
        });
    });

    getPaymentByStatus = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getPaymentByStatus(req.params.status);

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment' });
        }

        return res.status(201).json({
            message: "Payment fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    createPaymentMethod = expressAsyncHandler(async (req, res) => {
        const paymentData = new Billing(req.body);
        const payment = await this.service.createPaymentMethod(paymentData.createPaymentMethod);

        if (!payment) {
            res.status(500).json({ message: 'Failed to create payment method' });
        }

        return res.status(201).json({
            message: "Payment method created successfully",
            status: 'ok',
            data: payment
        });
    });

    getTotalPaymentByStatus = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getTotalPaymentByStatus();

        if (!payment) {
            res.status(500).json({ message: 'Failed to count payment' });
        }

        return res.status(201).json({
            message: "Payment counted successfully",
            status: 'ok',
            data: payment
        });
    });

    createPaymentAccess = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.createPaymentAccess(req.body);

        if (!payment) {
            res.status(500).json({ message: 'Failed to create payment access' });
        }

        return res.status(201).json({
            message: "Payment access created successfully",
            status: 'ok',
            data: payment
        });
    });

    getPaymentAccess = expressAsyncHandler(async (req, res) => {
        const payment = await this.service.getPaymentAccess();

        if (!payment) {
            res.status(500).json({ message: 'Failed to fetch payment access' });
        }

        return res.status(201).json({
            message: "Payment access fetched successfully",
            status: 'ok',
            data: payment
        });
    });

    updatePaymentAccess = expressAsyncHandler(async (req, res) => {
        const paymentAccess = await this.service.updatePaymentAccess(req.body);

        if (!paymentAccess) {
            res.status(500).json({ message: 'Failed to update payment Access' });
        }

        return res.status(201).json({
            message: "payment Access updated successfully",
            status: 'ok',
            data: paymentAccess
        });
    });

    payPaymentLink = expressAsyncHandler(async (req, res) => {
        const paymentData = new Billing({ ...req.body, status: req.body.paymentStatus });

        const paymentMethod = await this.service.createPaymentMethod(paymentData.createPaymentMethod);
        if (!paymentMethod) {
            res.status(500).json({ message: 'Failed to create payment method' });
        }

        const payment = await this.service.createPayment({ ...paymentData.createPayment, paymentMethodId: paymentMethod.id });
        if (!payment) {
            res.status(500).json({ message: 'Failed to create payment' });
        }

        if (payment.status === "FAILED") {
            return res.status(400).json({ message: "Payment failed, please try again." });
        }

        const subscriptionData = new Subscription({ ...req.body, status: "ACTIVE", startDate: payment.createdAt, paymentId: payment.id });
        const subscription = await this.subscriptionService.createSubscription(subscriptionData.createSubscription);
        if (!subscription) {
            res.status(500).json({ message: 'Failed to create subscription' });
        }

        const plan = await this.planService.getSingleBillingPlan({ id: req.body.planId });

        const invoice = await this.invoiceService.updateInvoice({ id: req.body.invoiceId, status: "Paid" });
        const invoiceToken = await this.invoiceService.markLatestTokenAsUsed(req.body.invoiceId);
        if (!invoice || !invoiceToken) {
            res.status(500).json({ message: 'Failed to update invoice' });
        }

        const tenant = await this.tenantService.updateTenant({
            id: req.body.tenantId,
            active: true
        });

        if (!tenant) {
            res.status(500).json({ message: 'Failed to update tenant.' });
        }

        const superAdmin = await this.adminService.getSuperAdmin();
        if (!superAdmin) {
            res.status(500).json({ message: 'Failed to fetch super admin.' });
        }

        const notif = await this.notificationService.createNotification({
            userId: superAdmin.id,
            userType: "ADMIN",
            type: "Payment Made for Plan",
            title: "Payment Made for Plan",
            content: `
                A payment has been recorded for tenant ${tenant.companyName}

                Product: NooSphere ABA PMS
                Subscription Plan: ${plan.name}
                Number of Licenses: ${plan.forStaff + plan.forClient}
                Billing Cycle: ${req.body.billingCycle}
                Amount Paid: $${req.body.amount}
                Payment Method: ${req.body.cardType} ending in ${req.body.lastFourDigits}
                Transaction ID: ${payment.id}
                Purchase Date: ${payment.createdAt.toDateString()}
            `,
            isRead: false
        });

        SocketService.emitToUser(notif.userId, notif.userType, "Payment Made for Plan", notif);

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "Logowrap/png",
            }
        ]

        const html = templateRenderer.render('billing-payment-confirmation.html', {
            customerName: tenant.companyName,
            subscriptionPlan: plan.name,
            numberOfLicenses: req.body.numberOfLicenses,
            billingCycle: req.body.billingCycle,
            amountPaid: req.body.amount,
            paymentMethod: `${req.body.cardType} ending in ${req.body.lastFourDigits}`,
            transactionId: payment.id,
            purchaseDate: payment.createdAt.toDateString()
        });

        const sendMail = await MailService.sendMail(tenant.email, "Payment Made for Plan", null, html, attachments)

        if (!sendMail.success) {
            throw new Error("Failed to send mail");
        }

        return res.status(201).json({
            message: "payment recorded successfully",
            status: 'ok',
            data: invoice
        });
    });
}

export default BillingController;
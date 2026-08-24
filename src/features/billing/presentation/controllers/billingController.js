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
import StaffRepository from "../../../tenant/infrastructure/staffRepository.js";
import TenantService from "../../../tenant/application/tenantService.js";
import AdminService from "../../../admin/application/adminService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import MailService from "../../../../utilities/nodemailer.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
import SocketService from "../../../../config/socket.js";
import ReferralCodeGenerator from "../../../../utilities/generateCode.js";
import argon2 from "argon2";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";
import auditLogger from "../../../logs/application/auditLogger.js";
import StripeBillingService from "../../application/stripeBillingService.js";

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
        this.stripeBillingService = new StripeBillingService({ prisma: this.prisma, invoiceService: this.invoiceService });

        this.subscriptionRepository = new SubscriptionRepository(this.prisma.subscription);
        this.subscriptionService = new SubscriptionService({ subscriptionRepository: this.subscriptionRepository });

        this.planRepository = new PlanRepository(this.prisma.billingPlan);
        this.planService = new PlanService({ planRepository: this.planRepository, adminRepository: null });

        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.staffRepository = new StaffRepository(this.prisma.tenantStaff);
        this.generateCode = new ReferralCodeGenerator(12);
        this.tenantService = new TenantService({
            tenantRepository: this.tenantRepository,
            prisma: this.prisma,
            staffRepository: this.staffRepository,
            generateCode: this.generateCode,
            templateRenderer,
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

        await auditLogger.log(req, {
            tenantId: billing?.tenantId || req.body?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Billing",
            action: `created billing metadata ${billing?.id}`,
            reason: "Billing management",
            accessedBy: req.user?.name || null,
        });

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

        await auditLogger.log(req, {
            tenantId: billing?.tenantId || req.body?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Billing",
            action: `updated billing metadata ${billing?.id}`,
            reason: "Billing management",
            accessedBy: req.user?.name || null,
        });

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

        await auditLogger.log(req, {
            tenantId: transaction?.tenantId || req.body?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : transaction?.clientId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Billing",
            action: `created transaction ${transaction?.id}`,
            reason: "Billing management",
            accessedBy: req.user?.name || null,
        });

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

        await auditLogger.log(req, {
            tenantId: payment?.tenantId || req.body?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : payment?.clientId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Billing",
            action: `created payment ${payment?.id}`,
            reason: "Billing management",
            accessedBy: req.user?.name || null,
        });

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

        await auditLogger.log(req, {
            tenantId: payment?.tenantId || req.body?.tenantId || null,
            clientId: req.user?.type === "CLIENT" ? req.user.clientId : payment?.clientId || null,
            adminId: req.user?.type === "ADMIN" ? req.user.id : null,
            module: req.user?.type === "ADMIN" ? "ADMIN" : req.user?.type === "STAFF" ? "TENANT" : req.user?.type === "CLIENT" ? "CLIENT" : null,
            feature: "Billing",
            action: `updated payment ${payment?.id}`,
            reason: "Billing management",
            accessedBy: req.user?.name || null,
        });

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
        return res.status(410).json({
            message: "This endpoint is deprecated. Confirm the Stripe PaymentIntent with /stripe/confirm-payment instead."
        });

        const paymentData = new Billing({ ...req.body, status: req.body.paymentStatus });

        const result = await this.prisma.$transaction(async (tx) => {
            const paymentMethod = await tx.paymentMethod.create({
                data: paymentData.createPaymentMethod,
            });

            const payment = await tx.payment.create({
                data: {
                    ...paymentData.createPayment,
                    paymentMethodId: paymentMethod.id,
                },
            });

            if (payment.status !== "Successful") {
                return { completed: false, payment };
            }

            const plan = await tx.billingPlan.findUnique({
                where: { id: req.body.planId },
            });

            if (!plan) {
                throw new Error("Plan not found");
            }

            const subscriptionData = new Subscription({
                ...req.body,
                status: "ACTIVE",
                startDate: payment.createdAt,
                paymentId: payment.id,
            });

            const subscription = await tx.subscription.create({
                data: subscriptionData.createSubscription,
            });

            const invoice = await tx.invoice.update({
                where: { id: req.body.invoiceId },
                data: { status: "Paid" },
            });

            const latestToken = await tx.invoiceToken.findFirst({
                where: { invoiceId: req.body.invoiceId },
                orderBy: { createdAt: "desc" },
            });

            if (!latestToken) {
                throw new Error("failed to update invoice token");
            }

            const invoiceToken = await tx.invoiceToken.update({
                where: { id: latestToken.id },
                data: { used: true },
            });

            const tenant = await tx.tenant.update({
                where: { id: req.body.tenantId },
                data: { active: true },
            });

            const tenantStaff = await tx.tenantStaff.findFirst({
                where: {
                    email: tenant.email,
                    isDeleted: false,
                    tenant: {
                        isDeleted: false,
                    },
                },
            });

            if (!tenantStaff) {
                throw new Error("Tenant staff not found.");
            }

            let welcomeEmail = null;

            if (!tenantStaff.password) {
                const generatedPass = this.generateCode.generateStrongPassword();
                const hashedPass = await argon2.hash(generatedPass);

                await tx.tenantStaff.update({
                    where: { id: tenantStaff.id },
                    data: { password: hashedPass },
                });

                welcomeEmail = {
                    companyName: tenant.companyName,
                    email: tenant.email,
                    password: generatedPass,
                    clientUrl: templateRenderer.buildTenantClientUrl(tenant.subdomain),
                    subdomain: tenant.subdomain,
                };
            }

            const superAdmin = await tx.admin.findFirst({
                where: { superAdmin: true },
            });

            if (!superAdmin) {
                throw new Error("Admin not found");
            }

            const notificationContent = `
                A payment has been recorded for tenant ${tenant.companyName}

                Product: NooSphere ABA PMS
                Subscription Plan: ${plan.name}
                Number of Licenses: ${plan.forStaff + plan.forClient}
                Billing Cycle: ${req.body.billingCycle}
                Amount Paid: $${req.body.amount}
                Payment Method: ${req.body.cardType} ending in ${req.body.lastFourDigits}
                Transaction ID: ${payment.id}
                Purchase Date: ${payment.createdAt.toDateString()}
            `;

            const notif = await tx.notification.create({
                data: {
                    userId: superAdmin.id,
                    userType: "ADMIN",
                    type: NotificationType.PAYMENT_MADE_FOR_PLAN,
                    title: "Payment Made for Plan",
                    content: notificationContent,
                    entityType: NotificationEntityType.PAYMENT,
                    entityId: String(payment.id),
                    metadata: {
                        tenantId: tenant.id,
                        invoiceId: invoice.id,
                        subscriptionId: subscription.id,
                        planId: plan.id,
                        transactionId: payment.transactionId || payment.transactionRef || String(payment.id),
                    },
                    isRead: false,
                },
            });

            return {
                completed: true,
                invoice,
                invoiceToken,
                notif,
                payment,
                paymentMethod,
                plan,
                subscription,
                tenant,
                welcomeEmail,
            };
        }, { timeout: 10_000 });

        if (!result.completed) {
            return res.status(400).json({
                message: result.payment.status === "Failed"
                    ? "Payment failed, please try again."
                    : "Payment has not completed."
            });
        }

        const { invoice, notif, payment, plan, tenant, welcomeEmail } = result;

        SocketService.emitToUser(notif.userId, notif.userType, "newNotification", { notification: notif });

        const tenantRecipients = await this.prisma.tenantStaff.findMany({
            where: { tenantId: tenant.id, isDeleted: false, active: true },
            select: { id: true },
        });
        await this.notificationService.dispatch({
            recipients: tenantRecipients.map((staff) => ({ userId: staff.id, userType: "TENANT_STAFF" })),
            type: NotificationType.PRODUCT_ACCESS,
            title: "Product Access Activated",
            content: `Your access to ${plan.name} is active.`,
            entityType: NotificationEntityType.SUBSCRIPTION,
            entityId: result.subscription.id,
            metadata: { tenantId: tenant.id, planId: plan.id, paymentId: payment.id },
        }, SocketService.emitToUser.bind(SocketService));

        const attachments = [
            {
                filename: "Logowrap.png",
                path: "Logowrap.png",
                cid: "unique@image",
                contentType: "Logowrap/png",
            }
        ]

        if (welcomeEmail) {
            const welcomeHtml = await templateRenderer.render('tenant-welcome.html', welcomeEmail);

            const welcomeMail = await MailService.sendMail(
                welcomeEmail.email,
                "Welcome to Noosphere",
                null,
                welcomeHtml,
                attachments
            );

            if (!welcomeMail.success) {
                throw new Error("Failed to send tenant welcome mail");
            }
        }

        const html = await templateRenderer.render('billing-payment-confirmation.html', {
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

    createStripePaymentIntent = expressAsyncHandler(async (req, res) => {
        try {
            const paymentIntent = await this.stripeBillingService.createPaymentIntent(req.body.token);
            return res.status(200).json(paymentIntent);
        } catch (error) {
            const statusCode = error.statusCode || (error.type?.startsWith("Stripe") ? 500 : 400);
            return res.status(statusCode).json({ message: error.message });
        }
    });

    confirmStripePayment = expressAsyncHandler(async (req, res) => {
        try {
            const result = await this.stripeBillingService.confirmPayment(req.body.token, req.body.paymentIntentId);
            return res.status(result.alreadyPaid ? 200 : 201).json({
                message: "payment recorded successfully",
                status: "ok",
                data: result.invoice
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });

    stripeWebhook = async (req, res) => {
        try {
            if (!process.env.STRIPE_WEBHOOK_SECRET) {
                return res.status(500).json({ message: "STRIPE_WEBHOOK_SECRET is not configured" });
            }

            const event = this.stripeBillingService.stripe.webhooks.constructEvent(
                req.body,
                req.headers["stripe-signature"],
                process.env.STRIPE_WEBHOOK_SECRET
            );
            await this.stripeBillingService.handleWebhook(event);
            return res.status(200).json({ received: true });
        } catch (error) {
            return res.status(400).json({ message: `Webhook Error: ${error.message}` });
        }
    };
}

export default BillingController;

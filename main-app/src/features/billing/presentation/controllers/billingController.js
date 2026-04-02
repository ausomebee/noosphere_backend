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
import InvoiceTokenRepository from "../../../invoice/infrastructure/invoiceTokenRepository.js";
import TenantRepository from "../../../tenant/infrastructure/tenantRepository.js";
import TenantService from "../../../tenant/application/tenantService.js";
import AdminService from "../../../admin/application/adminService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import MailService from "../../../../utilities/nodemailer.js";
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
                Subscription Plan: Enterprise Plan
                Number of Licenses: 50
                Billing Cycle: Annual
                Amount Paid: $12,000
                Payment Method: Card ending in 8421
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

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Confirmation - Your subscription receipt</title>
                <style>
                    body, table, td, p, a {
                        margin: 0;
                        padding: 0;
                        border: 0;
                        font-size: 100%;
                        font: inherit;
                        vertical-align: baseline;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .email-content {
                        padding: 40px 30px;
                    }
                    
                    .logo-container {
                        margin-bottom: 30px;
                        text-align: center;
                    }
                    
                    .logo {
                        display: inline-flex;
                        align-items: center;
                        font-size: 40px;
                        font-weight: 600;
                        color: #000000;
                        text-decoration: none;
                    }

                    .greeting {
                        font-size: 16px;
                        color: #333333;
                        margin-bottom: 8px;
                    }

                    .intro-text {
                        font-size: 16px;
                        color: #475467;
                        margin-bottom: 30px;
                    }

                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #004ABA;
                        margin-bottom: 16px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #E0E0E0;
                    }
                    
                    .billing-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }

                    .billing-table tr {
                        border-bottom: 1px solid #F2F4F7;
                    }

                    .billing-table tr:last-child {
                        border-bottom: none;
                    }

                    .billing-table td {
                        padding: 12px 0;
                        font-size: 15px;
                    }

                    .billing-label {
                        color: #475467;
                        width: 50%;
                    }

                    .billing-value {
                        color: #101828;
                        font-weight: 500;
                        text-align: right;
                    }

                    .billing-value.amount {
                        color: #004ABA;
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .info-box {
                        background-color: #E3F2FD;
                        border-radius: 8px;
                        padding: 16px 20px;
                        margin: 25px 0;
                        border: 1px solid #99C2FF;
                        font-size: 15px;
                        color: #475467;
                    }

                    .support-text {
                        font-size: 15px;
                        color: #475467;
                        margin-bottom: 25px;
                    }

                    .support-text a {
                        color: #004ABA;
                        text-decoration: none;
                    }

                    .divider {
                        border: none;
                        border-top: 1px solid #E0E0E0;
                        margin: 25px 0;
                    }

                    .thank-you-text {
                        font-size: 15px;
                        color: #475467;
                        margin-bottom: 20px;
                    }
                    
                    .footer {
                        margin-top: 20px;
                    }
                    
                    .footer-text {
                        color: #1976D2;
                        font-size: 16px;
                        margin-bottom: 5px;
                    }
                    
                    .team-signature {
                        color: #1976D2;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    
                    @media only screen and (max-width: 600px) {
                        .email-container {
                            margin: 0;
                            border-radius: 0;
                        }
                        
                        .email-content {
                            padding: 30px 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-content">

                        <div class="logo-container">
                            <div class="logo">
                                <img src="cid:unique@image" alt="NooSphere" srcset="">
                            </div>
                        </div>

                        <p class="greeting">Hello ${data.customerName},</p>
                        <p class="intro-text">Your payment has been successfully processed. Thank you for your purchase.</p>

                        <p class="section-title">Billing Summary</p>

                        <table class="billing-table">
                            <tr>
                                <td class="billing-label">Product</td>
                                <td class="billing-value">NooSphere ABA PMS</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Subscription Plan</td>
                                <td class="billing-value">${data.subscriptionPlan}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Number of Licenses</td>
                                <td class="billing-value">${data.numberOfLicenses}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Billing Cycle</td>
                                <td class="billing-value">${data.billingCycle}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Amount Paid</td>
                                <td class="billing-value amount">${data.amountPaid}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Payment Method</td>
                                <td class="billing-value">${data.paymentMethod}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Transaction ID</td>
                                <td class="billing-value">${data.transactionId}</td>
                            </tr>
                            <tr>
                                <td class="billing-label">Purchase Date</td>
                                <td class="billing-value">${data.purchaseDate}</td>
                            </tr>
                        </table>

                        <div class="info-box">
                            Your invoice is attached to this email for your records.
                        </div>

                        <p class="support-text">
                            If you have any billing questions, please contact our finance team at
                            <a href="mailto:billing@noospherhub.net">billing@noospherhub.net</a>
                        </p>

                        <hr class="divider">

                        <p class="thank-you-text">Thank you for your business.</p>

                        <div class="footer">
                            <p class="footer-text">Best regards,</p>
                            <p class="team-signature">NooSphere Team</p>
                        </div>

                    </div>
                </div>
            </body>
            </html>
        `;

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
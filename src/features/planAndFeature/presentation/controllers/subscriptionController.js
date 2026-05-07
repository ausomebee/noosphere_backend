import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import SubscriptionRepository from "../../../planAndFeature/infrastructure/subscriptionRepository.js";
import Subscription from "../../domain/subscription.js";
import SubscriptionService from "../../application/subscriptionService.js";
import LogsService from "../../../logs/application/logsService.js";
import LogsRepository from "../../../logs/infrastructure/logsRepository.js";
import AdminService from "../../../admin/application/adminService.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import SocketService from "../../../../config/socket.js";
import MailService from "../../../../utilities/nodemailer.js";
import TenantRepository from "../../../tenant/infrastructure/tenantRepository.js";
import TenantService from "../../../tenant/application/tenantService.js";

class SubscriptionController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.tenantRepository = new TenantRepository(this.prisma.tenant);
        this.tenantService = new TenantService({
            tenantRepository: this.tenantRepository,
            prisma: this.prisma,
        });
        this.subscriptionRepository = new SubscriptionRepository(this.prisma.subscription);
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.service = new SubscriptionService({ subscriptionRepository: this.subscriptionRepository });
        this.logService = new LogsService({ logsRepository: this.logsRepository });
        this.adminService = new AdminService();
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
    }

    createSubscription = expressAsyncHandler(async (req, res) => {
        const subscriptionData = new Subscription(req.body);
        const subscription = await this.service.createSubscription(subscriptionData.createSubscription);

        if (!subscription) {
            res.status(500).json({ message: 'Failed to create subscription' });
        }

        return res.status(201).json({
            message: "subscription created successfully",
            status: 'ok',
            data: subscription,
        });
    });

    updateSubscription = expressAsyncHandler(async (req, res) => {
        const subscriptionData = new Subscription(req.body);

        const subscription = await this.service.updateSubscriptions(req.body);

        if (!subscription) {
            res.status(500).json({ message: 'Failed to update subscription' });
        }

        if (subscription.status === "CANCELLED" || subscription.status === "PAUSED") {
            const superAdmin = await this.adminService.getSuperAdmin();
            if (!superAdmin) {
                res.status(500).json({ message: 'Failed to fetch super admin.' });
            }

            const notif = await this.notificationService.createNotification({
                userId: superAdmin.id,
                userType: "ADMIN",
                type: `Subscription ${subscription.status}`,
                title: `Subscription ${subscription.status}`,
                content: `
                        A subscription has been ${subscription.status.toLowerCase()} on NooSphere. Click here to view details
                    `,
                isRead: false
            });

            SocketService.emitToUser(notif.userId, notif.userType, `Subscription ${subscription.status}`, notif);

            const attachments = [
                {
                    filename: "Logowrap.png",
                    path: "Logowrap.png",
                    cid: "unique@image",
                    contentType: "Logowrap/png",
                }
            ]

            const isCancelled = subscription.status === "CANCELLED";

            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Subscription ${isCancelled ? "Cancelled" : "Paused"} - NooSphere</title>
                    <style>
                        body, table, td, p, a {
                            margin: 0; padding: 0; border: 0;
                            font-size: 100%; font: inherit; vertical-align: baseline;
                        }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                            line-height: 1.6; color: #333333;
                            background-color: #f5f5f5; margin: 0; padding: 20px;
                        }
                        .email-container {
                            max-width: 600px; margin: 0 auto;
                            background-color: #ffffff; border-radius: 12px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;
                        }
                        .email-content { padding: 40px 30px; }
                        .logo-container { margin-bottom: 30px; text-align: center; }
                        .logo {
                            display: inline-flex; align-items: center;
                            font-size: 40px; font-weight: 600; color: #000000; text-decoration: none;
                        }
                        .status-badge {
                            display: inline-block;
                            background-color: ${isCancelled ? "#FEE4E2" : "#FEF0C7"};
                            color: ${isCancelled ? "#B42318" : "#B54708"};
                            border: 1px solid ${isCancelled ? "#FECDCA" : "#FEDF89"};
                            border-radius: 20px; padding: 6px 18px;
                            font-size: 14px; font-weight: 600;
                            margin-bottom: 20px;
                        }
                        .greeting { font-size: 16px; color: #333333; margin-bottom: 8px; }
                        .intro-text { font-size: 16px; color: #475467; margin-bottom: 30px; }
                        .section-title {
                            font-size: 18px; font-weight: 600;
                            color: #004ABA; margin-bottom: 16px;
                            padding-bottom: 10px; border-bottom: 1px solid #E0E0E0;
                        }
                        .billing-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .billing-table tr { border-bottom: 1px solid #F2F4F7; }
                        .billing-table tr:last-child { border-bottom: none; }
                        .billing-table td { padding: 12px 0; font-size: 15px; }
                        .billing-label { color: #475467; width: 50%; }
                        .billing-value { color: #101828; font-weight: 500; text-align: right; }
                        .billing-value.status-val {
                            color: ${isCancelled ? "#B42318" : "#B54708"};
                            font-weight: 600;
                        }
                        .info-box {
                            background-color: ${isCancelled ? "#FEF3F2" : "#FFFAEB"};
                            border-radius: 8px; padding: 16px 20px; margin: 25px 0;
                            border: 1px solid ${isCancelled ? "#FECDCA" : "#FEDF89"};
                            font-size: 15px;
                            color: ${isCancelled ? "#912018" : "#7A2E0E"};
                        }
                        .support-text { font-size: 15px; color: #475467; margin-bottom: 25px; }
                        .support-text a { color: #004ABA; text-decoration: none; }
                        .divider { border: none; border-top: 1px solid #E0E0E0; margin: 25px 0; }
                        .closing-text { font-size: 15px; color: #475467; margin-bottom: 20px; }
                        .footer { margin-top: 20px; }
                        .footer-text { color: #1976D2; font-size: 16px; margin-bottom: 5px; }
                        .team-signature { color: #1976D2; font-size: 16px; font-weight: 600; }
                        @media only screen and (max-width: 600px) {
                            .email-container { margin: 0; border-radius: 0; }
                            .email-content { padding: 30px 20px; }
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

                            <div style="text-align: center;">
                                <span class="status-badge">Subscription ${isCancelled ? "Cancelled" : "Paused"}</span>
                            </div>

                            <p class="greeting">Hello ${tenant.name},</p>
                            <p class="intro-text">
                                ${isCancelled
                    ? "Your NooSphere subscription has been cancelled. We're sorry to see you go."
                    : "Your NooSphere subscription has been paused. Your account access is temporarily suspended."
                }
                            </p>

                            <p class="section-title">Subscription Details</p>

                            <table class="billing-table">
                                <tr>
                                    <td class="billing-label">Organization</td>
                                    <td class="billing-value">${tenant.name}</td>
                                </tr>
                                <tr>
                                    <td class="billing-label">Subscription Plan</td>
                                    <td class="billing-value">${subscription.plan}</td>
                                </tr>
                                <tr>
                                    <td class="billing-label">Status</td>
                                    <td class="billing-value status-val">${subscription.status}</td>
                                </tr>
                                <tr>
                                    <td class="billing-label">Effective Date</td>
                                    <td class="billing-value">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                                </tr>
                            </table>

                            <div class="info-box">
                                ${isCancelled
                    ? "Your data will be retained for 30 days. After this period, it will be permanently deleted. If this was a mistake, please contact us immediately."
                    : "Your account and data are safe. You can resume your subscription at any time by logging in and updating your billing information."
                }
                            </div>

                            <p class="support-text">
                                If you have any questions or believe this was done in error, please reach out to us at
                                <a href="mailto:support@noospherhub.net">support@noospherhub.net</a>
                            </p>

                            <hr class="divider">

                            <p class="closing-text">
                                ${isCancelled
                    ? "Thank you for being a NooSphere customer. We hope to serve you again in the future."
                    : "We look forward to having you back."
                }
                            </p>

                            <div class="footer">
                                <p class="footer-text">Best regards,</p>
                                <p class="team-signature">NooSphere Team</p>
                            </div>

                        </div>
                    </div>
                </body>
                </html>
            `;

            const tenant = await this.tenantTervice.getTenantById(subscription.tenantId);

            const sendMail = await MailService.sendMail(tenant.email, `Subscription ${subscription.status}`, null, html, attachments)

            if (!sendMail.success) {
                throw new Error("Failed to send mail");
            }
        }

        const log = await this.logService.createLog(subscriptionData.createLog);

        if (!log) {
            res.status(500).json({ message: 'Failed to log action' });
        }

        return res.status(201).json({
            message: "subscription updated successfully",
            status: 'ok',
            data: subscription
        });
    });

    getSingleSubscription = expressAsyncHandler(async (req, res) => {
        const subscription = await this.service.getSingleSubscription(req.params);

        if (!subscription) {
            res.status(500).json({ message: 'Failed to fetch subscription' });
        }

        return res.status(201).json({
            message: "subscription fetched successfully",
            status: 'ok',
            data: subscription
        });
    });

    getAllSubscription = expressAsyncHandler(async (req, res) => {
        const subscription = await this.service.getAllSubscription();

        if (!subscription) {
            res.status(500).json({ message: 'Failed to fetch subscription' });
        }

        return res.status(201).json({
            message: "subscription fetched successfully",
            status: 'ok',
            data: subscription
        });
    });

    getSubscriptionByPlan = expressAsyncHandler(async (req, res) => {
        const subscriptions = await this.service.getSubscriptionByPlan(req.params.planId);

        if (!subscriptions) {
            res.status(500).json({ message: 'Failed to fetch subscriptions' });
        }

        return res.status(201).json({
            message: "subscriptions fetched successfully",
            status: 'ok',
            data: subscriptions
        });
    });

    getTotalSubscriptionByStatus = expressAsyncHandler(async (req, res) => {
        const subscription = await this.service.getTotalSubscriptionByStatus();

        if (!subscription) {
            res.status(500).json({ message: 'Failed to count subscription' });
        }

        return res.status(201).json({
            message: "subscription counted successfully",
            status: 'ok',
            data: subscription
        });
    });

    getSubscriptionByStatus = expressAsyncHandler(async (req, res) => {
        const subscription = await this.service.getSubscriptionByStatus();

        if (!subscription) {
            res.status(500).json({ message: 'Failed to count subscription' });
        }

        return res.status(201).json({
            message: "subscription counted successfully",
            status: 'ok',
            data: subscription
        });
    });

    getTenantSubscriptions = expressAsyncHandler(async (req, res) => {
        const subscriptions = await this.service.getTenantSubscriptions(req.params.tenantId);

        if (!subscriptions) {
            res.status(500).json({ message: 'Failed to fetch subscriptions for this tenant' });
        }

        return res.status(201).json({
            message: "subscriptions for this tenant fetched successfully",
            status: 'ok',
            data: subscriptions
        });
    });
}

export default SubscriptionController;
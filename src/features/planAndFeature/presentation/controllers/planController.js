import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";
import PlanService from "../../application/planService.js";
import AdminRepository from "../../../admin/infrastructure/adminRepository.js";
import AdminService from "../../../admin/application/adminService.js";
import MailService from "../../../../utilities/nodemailer.js";
import templateRenderer from "../../../../utilities/templateRenderer.js";
import NotificationsRepository from "../../../notifications/infrastructure/notificationsRepository.js";
import NotificationService from "../../../notifications/application/notificationsService.js";
import SocketService from "../../../../config/socket.js";
import { NotificationEntityType, NotificationType } from "../../../notifications/domain/notificationTypes.js";

class PlanController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.planRepository = new PlanRepository(this.prisma.billingPlan);
        this.adminRepository = new AdminRepository(this.prisma.admin);
        this.service = new PlanService({ planRepository: this.planRepository, adminRepository: this.adminRepository });
        this.adminService = new AdminService();
        this.notificationRepository = new NotificationsRepository(this.prisma.notification);
        this.notificationService = new NotificationService({ notificationRepository: this.notificationRepository });
    }

    async notifySuperAdmin(type, title, content, plan, metadata = {}) {
        const superAdmin = await this.adminService.getSuperAdmin();
        if (!superAdmin) return [];

        return this.notificationService.dispatch({
            recipients: [{ userId: superAdmin.id, userType: "ADMIN" }],
            type,
            title,
            content,
            entityType: NotificationEntityType.PLAN,
            entityId: plan.id,
            metadata: { planName: plan.name, ...metadata },
        }, SocketService.emitToUser.bind(SocketService));
    }

    createBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.createBillingPlan(req.body);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to create billing Plan' });
        }

        const superAdmin = await this.adminService.getSuperAdmin();
        await this.notifySuperAdmin(
            NotificationType.PLAN_CREATED,
            "Plan Created",
            "A plan has been created on NooSphere. Click here to view details.",
            billingPlan
        );
        if (superAdmin?.email) {
            const html = templateRenderer.render('plan-created-superadmin', {
                planName: billingPlan.name || 'N/A',
            });
            await MailService.sendMail(
                superAdmin.email,
                'New Plan Created on NooSphere',
                `A new billing plan ${billingPlan.name} has been created on NooSphere. Click here to view details.`,
                html
            );
        }

        return res.status(201).json({
            message: "billing Plan created successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    updateBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.updateBillingPlan(req.body);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to update billing Plan' });
        }

        if (req.body.active === false) {
            const superAdmin = await this.adminService.getSuperAdmin();
            await this.notifySuperAdmin(
                NotificationType.PLAN_DEACTIVATED,
                "Plan Deactivated",
                "A plan has been deactivated on NooSphere. Click here to view details.",
                billingPlan
            );
            if (superAdmin?.email) {
                const html = templateRenderer.render('plan-deactivated-superadmin', {
                    planName: billingPlan.name || 'N/A',
                });
                await MailService.sendMail(
                    superAdmin.email,
                    `Plan Deactivated: ${billingPlan.name}`,
                    `The billing plan ${billingPlan.name} has been deactivated on NooSphere. Click here to view details.`,
                    html
                );
            }
        } else if (req.body.active === true) {
            const superAdmin = await this.adminService.getSuperAdmin();
            if (superAdmin?.email) {
                const html = templateRenderer.render('plan-activated-superadmin', {
                    planName: billingPlan.name || 'N/A',
                });
                await MailService.sendMail(
                    superAdmin.email,
                    `Plan Activated: ${billingPlan.name}`,
                    `The billing plan ${billingPlan.name} has been activated on NooSphere. Click here to view details.`,
                    html
                );
            }
        }

        return res.status(201).json({
            message: "billing Plan updated successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    getSingleBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.getSingleBillingPlan(req.params);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to fetch billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan fetched successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    getAllBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.getAllBillingPlan();

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to fetch billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan fetched successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    getBillingPlanByType = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.getBillingPlanByType(req.params.planType);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to fetch billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan fetched successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    duplicateBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.duplicateBillingPlan(req.params.id);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to duplicate billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan duplicated successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    deleteBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.deleteBillingPlan(req.body);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to delete billing Plan' });
        }

        const superAdmin = await this.adminService.getSuperAdmin();
        await this.notifySuperAdmin(
            NotificationType.PLAN_DELETED,
            "Plan Deleted",
            "A plan has been deleted on NooSphere.",
            billingPlan
        );
        if (superAdmin?.email) {
            const html = templateRenderer.render('plan-deleted-superadmin', {});
            await MailService.sendMail(
                superAdmin.email,
                'A Billing Plan Has Been Deleted on NooSphere',
                'A billing plan has been deleted on NooSphere.',
                html
            );
        }

        return res.status(201).json({
            message: "billing Plan deleted successfully",
            status: 'ok',
            data: billingPlan
        });
    });

}

export default PlanController;

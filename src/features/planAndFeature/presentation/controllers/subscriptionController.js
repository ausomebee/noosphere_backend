import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import SubscriptionRepository from "../../../planAndFeature/infrastructure/subscriptionRepository.js";
import Subscription from "../../domain/subscription.js";
import SubscriptionService from "../../application/subscriptionService.js";
import LogsService from "../../../logs/application/logsService.js";
import LogsRepository from "../../../logs/infrastructure/logsRepository.js";

class SubscriptionController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.subscriptionRepository = new SubscriptionRepository(this.prisma.subscription);
        this.logsRepository = new LogsRepository(this.prisma.logs);
        this.service = new SubscriptionService({ subscriptionRepository: this.subscriptionRepository });
        this.logService = new LogsService({ logsRepository: this.logsRepository });
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
            data: subscription
        });
    });

    updateSubscription = expressAsyncHandler(async (req, res) => {
        const subscriptionData = new Subscription(req.body);

        const subscription = await this.service.updateSubscriptions(req.body);

        if (!subscription) {
            res.status(500).json({ message: 'Failed to update subscription' });
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
        const subscriptions = await this.service.getSubscriptionByPlan(req.params, planId);

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
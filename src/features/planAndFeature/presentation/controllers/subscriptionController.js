import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import SubscriptionRepository from "../../../planAndFeature/infrastructure/subscriptionRepository.js";
import Subscription from "../../domain/subscription.js";
import SubscriptionService from "../../application/subscriptionService.js";

class SubscriptionController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.subscriptionRepository = new SubscriptionRepository(this.prisma.subscription);
        this.service = new SubscriptionService({ subscriptionRepository: this.subscriptionRepository });
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
        const subscription = await this.service.updateSubscription(req.body);

        if (!subscription) {
            res.status(500).json({ message: 'Failed to update subscription' });
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

}

export default SubscriptionController;
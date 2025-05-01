import expressAsyncHandler from "express-async-handler";
import BillingService from "../../application/billingService.js";
import Billing from "../../domain/billing.js";

class BillingController {
    constructor() {
        this.service = new BillingService();
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

    // updateTransaction = expressAsyncHandler(async (req, res) => {
    //     const transaction = await this.service.updateTransaction(req.body);

    //     if (!transaction) {
    //         res.status(500).json({ message: 'Failed to update transaction' });
    //     }

    //     return res.status(201).json({
    //         message: "Transaction updated successfully",
    //         status: 'ok',
    //         data: transaction
    //     });
    // });

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

    createSubscription = expressAsyncHandler(async (req, res) => {
        const subscriptionData = new Billing(req.body);
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

    createBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlanData = new Billing(req.body);
        const billingPlan = await this.service.createBillingPlan(billingPlanData.createBillingPlan);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to create billing Plan' });
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

    createFeature = expressAsyncHandler(async (req, res) => {
        const featureData = new Billing(req.body);
        const feature = await this.service.createFeature(featureData.createFeature);

        if (!feature) {
            res.status(500).json({ message: 'Failed to create feature' });
        }

        return res.status(201).json({
            message: "feature created successfully",
            status: 'ok',
            data: feature
        });
    });

    updateFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.updateFeature(req.body);

        if (!feature) {
            res.status(500).json({ message: 'Failed to update feature' });
        }

        return res.status(201).json({
            message: "feature updated successfully",
            status: 'ok',
            data: feature
        });
    });

    getSingleFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.getSingleFeature(req.params);

        if (!feature) {
            res.status(500).json({ message: 'Failed to fetch feature' });
        }

        return res.status(201).json({
            message: "feature fetched successfully",
            status: 'ok',
            data: feature
        });
    });

    getAllFeature = expressAsyncHandler(async (req, res) => {
        const feature = await this.service.getAllFeature();

        if (!feature) {
            res.status(500).json({ message: 'Failed to fetch feature' });
        }

        return res.status(201).json({
            message: "feature fetched successfully",
            status: 'ok',
            data: feature
        });
    });
}

export default BillingController;
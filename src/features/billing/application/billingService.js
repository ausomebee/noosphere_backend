import BillingRepository from "../infrastructure/billingRepository.js";

class BillingService {
    constructor() {
        this.repository = new BillingRepository()
    }

    async createBillingMetadata(data) {
        const billingMetadataExists = await this.repository.findFirstBillingMetadata({
            where: { OR: [{ tenantId: data.tenantId }] },
            select: { tenantId: true }
        });

        if (billingMetadataExists) {
            throw new Error("This BillingMetadata already exists.");
        }

        const newBillingMetadata = await this.repository.createBillingMetadata(data);

        if (!newBillingMetadata) {
            throw new Error("Failed to create BillingMetadata");
        }

        return newBillingMetadata;
    }

    async updateBillingMetadata(data) {
        const billingMetadata = await this.repository.findOneBillingMetadata({ id: data.id })

        if (!billingMetadata) {
            throw new Error("Billing Metadata not found");
        }

        const update = await this.repository.update(data.id, {
            paymentMethod: data.paymentMethod || billingMetadata.paymentMethod,
            billingAddress: data.billingAddress || billingMetadata.billingAddress
        });

        if (!update) {
            throw new Error("Failed to update Billing Metadata");
        }

        return update;
    }

    async getSingleBillingMetadata(data) {
        const billingMetadata = await this.repository.findOneBillingMetadata({
            id: data.id
        });

        if (!billingMetadata) {
            throw new Error("billingMetadata not found")
        }

        return billingMetadata;
    }

    async getAllBillingMetadata(data) {
        const billingMetadata = await this.repository.findAllBillingMetadata({});

        if (!billingMetadata) {
            throw new Error("billingMetadata not found")
        }

        return billingMetadata;
    }

    async createTransaction(data) {
        const newTransaction = await this.repository.createTransaction(data);

        if (!newTransaction) {
            throw new Error("Failed to create Transaction");
        }

        return newTransaction;
    }

    // async updateTransaction(data) {
    //     const Transaction = await this.repository.findOneTransaction({ id: data.id })

    //     if (!Transaction) {
    //         throw new Error("Transaction not found");
    //     }

    //     const update = await this.repository.update(data.id, {
    //         paymentMethod: data.paymentMethod || Transaction.paymentMethod,
    //         billingAddress: data.billingAddress || Transaction.billingAddress
    //     });

    //     if (!update) {
    //         throw new Error("Failed to update Transaction");
    //     }

    //     return update;
    // }

    async getSingleTransaction(data) {
        const Transaction = await this.repository.findOneTransaction({
            id: data.id
        });

        if (!Transaction) {
            throw new Error("Transaction not found")
        }

        return Transaction;
    }

    async getAllTransaction(data) {
        const Transaction = await this.repository.findAllTransactions({});

        if (!Transaction) {
            throw new Error("Transaction not found")
        }

        return Transaction;
    }

    async createSubscription(data) {
        const subscriptionExists = await this.repository.findFirstSubscription({
            where: { OR: [{ tenantId: data.tenantId }] },
            select: { tenantId: true }
        });

        if (subscriptionExists) {
            throw new Error("This subscription already exists.");
        }

        const newSubscription = await this.repository.createSubscription(data);

        if (!newSubscription) {
            throw new Error("Failed to create subscription");
        }

        return newSubscription;
    }

    async updateSubscription(data) {
        const subscription = await this.repository.findOneSubscription({ id: data.id })

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        const update = await this.repository.update(data.id, {
            planId: data.planId || subscription.planId,
            status: data.status || subscription.status,
            startDate: data.startDate || subscription.startDate,
            endDate: data.endDate || subscription.endDate
        });

        if (!update) {
            throw new Error("Failed to update Subscription");
        }

        return update;
    }

    async getSingleSubscription(data) {
        const subscription = await this.repository.findOneSubscription({
            id: data.id
        });

        if (!subscription) {
            throw new Error("Subscription not found")
        }

        return subscription;
    }

    async getAllSubscription(data) {
        const subscription = await this.repository.findAllSubscriptions({});

        if (!subscription) {
            throw new Error("Subscription not found")
        }

        return subscription;
    }

    async createBillingPlan(data) {
        const billingPlanExists = await this.repository.findFirstBillingPlan({
            where: { name: data.name },
            select: { name: true }
        });

        if (billingPlanExists) {
            throw new Error("This billingPlan already exists.");
        }

        const newBillingPlan = await this.repository.createBillingPlan(data);

        if (!newBillingPlan) {
            throw new Error("Failed to create BillingPlan");
        }

        return newBillingPlan;
    }

    async updateBillingPlan(data) {
        const billingPlan = await this.repository.findOneBillingPlan({ id: data.id })

        if (!billingPlan) {
            throw new Error("BillingPlan not found");
        }

        const update = await this.repository.update(data.id, {
            name: data.name || billingPlan.name,
            description: data.description || billingPlan.description,
            price: data.price || billingPlan.price,
            billingCycle: data.billingCycle || billingPlan.billingCycle
        });
        
        if (!update) {
            throw new Error("Failed to update Billing Plan");
        }

        return update;
    }

    async getSingleBillingPlan(data) {
        const billingPlan = await this.repository.findOneBillingPlan({
            id: data.id
        });

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async getAllBillingPlan(data) {
        const billingPlan = await this.repository.findAllBillingPlans({});

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async createFeature(data) {
        const featureExists = await this.repository.findFirstFeature({
            where: { name: data.name },
            select: { name: true }
        });

        if (featureExists) {
            throw new Error("This Feature already exists.");
        }

        const newFeature = await this.repository.createFeature(data);

        if (!newFeature) {
            throw new Error("Failed to create Feature");
        }

        return newFeature;
    }

    async updateFeature(data) {
        const feature = await this.repository.findOneFeature({ id: data.id })

        if (!feature) {
            throw new Error("Feature not found");
        }

        const update = await this.repository.update(data.id, {
            name: data.name || feature.name,
            description: data.description || feature.description,
            price: data.price || feature.price,
            billingCycle: data.billingCycle || feature.billingCycle
        });
        
        if (!update) {
            throw new Error("Failed to update Billing Plan");
        }

        return update;
    }

    async getSingleFeature(data) {
        const feature = await this.repository.findOneFeature({
            id: data.id
        });

        if (!feature) {
            throw new Error("Feature not found")
        }

        return feature;
    }

    async getAllFeature(data) {
        const feature = await this.repository.findAllFeatures({});

        if (!feature) {
            throw new Error("Feature not found")
        }

        return feature;
    }
}

export default BillingService;
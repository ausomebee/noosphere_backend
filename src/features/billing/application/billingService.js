
class BillingService {
    constructor({ transactionsRepository, billingRepository, subscriptionRepository, planRepository, paymentRepository, featureRepository }) {
        this.transactionsRepository = transactionsRepository;
        this.billingRepository = billingRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.paymentRepository = paymentRepository;
        this.featureRepository = featureRepository;
    }

    async createBillingMetadata(data) {
        const billingMetadataExists = await this.billingRepository.findFirstDynamic({
            where: { tenantId: data.tenantId },
            select: { tenantId: true }
        });

        if (billingMetadataExists) {
            throw new Error("This BillingMetadata already exists.");
        }

        const newBillingMetadata = await this.billingRepository.create(data);

        if (!newBillingMetadata) {
            throw new Error("Failed to create BillingMetadata");
        }

        return newBillingMetadata;
    }

    async updateBillingMetadata(data) {
        const billingMetadata = await this.billingRepository.findOne({ id: data.id })

        if (!billingMetadata) {
            throw new Error("Billing Metadata not found");
        }

        const update = await this.billingRepository.update(data.id, {
            paymentMethod: data.paymentMethod || billingMetadata.paymentMethod,
            billingAddress: data.billingAddress || billingMetadata.billingAddress
        });

        if (!update) {
            throw new Error("Failed to update Billing Metadata");
        }

        return update;
    }

    async getSingleBillingMetadata(data) {
        const billingMetadata = await this.billingRepository.findOne({ id: data.id });

        if (!billingMetadata) {
            throw new Error("billingMetadata not found")
        }

        return billingMetadata;
    }

    async getAllBillingMetadata(data) {
        const billingMetadata = await this.billingRepository.findAll({});

        if (!billingMetadata) {
            throw new Error("billingMetadata not found")
        }

        return billingMetadata;
    }

    async createTransaction(data) {
        const newTransaction = await this.transactionsRepository.create(data);

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
        const Transaction = await this.transactionsRepository.findOne({ id: data.id });

        if (!Transaction) {
            throw new Error("Transaction not found")
        }

        return Transaction;
    }

    async getAllTransaction(data) {
        const Transaction = await this.transactionsRepository.findAll({});

        if (!Transaction) {
            throw new Error("Transaction not found")
        }

        return Transaction;
    }

    async createSubscription(data) {
        const subscriptionExists = await this.subscriptionRepository.findFirstDynamic({
            where: { OR: [{ tenantId: data.tenantId }] },
            select: { tenantId: true }
        });

        if (subscriptionExists) {
            throw new Error("This subscription already exists.");
        }

        const newSubscription = await this.subscriptionRepository.create(data);

        if (!newSubscription) {
            throw new Error("Failed to create subscription");
        }

        return newSubscription;
    }

    async updateSubscription(data) {
        const subscription = await this.subscriptionRepository.findOne({ id: data.id })

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        const update = await this.subscriptionRepository.update(data.id, {
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
        const subscription = await this.subscriptionRepository.findOne({ id: data.id });

        if (!subscription) {
            throw new Error("Subscription not found")
        }

        return subscription;
    }

    async getAllSubscription(data) {
        const subscription = await this.subscriptionRepository.findAll({});

        if (!subscription) {
            throw new Error("Subscription not found")
        }

        return subscription;
    }

    async createBillingPlan(data) {
        const billingPlanExists = await this.planRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (billingPlanExists) {
            throw new Error("This billingPlan already exists.");
        }

        const newBillingPlan = await this.planRepository.create(data);

        if (!newBillingPlan) {
            throw new Error("Failed to create BillingPlan");
        }

        return newBillingPlan;
    }

    async updateBillingPlan(data) {
        const billingPlan = await this.planRepository.findOne({ id: data.id })

        if (!billingPlan) {
            throw new Error("BillingPlan not found");
        }

        const update = await this.planRepository.update(data.id, {
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
        const billingPlan = await this.paymentRepository.findOne({ id: data.id });

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async getAllBillingPlan(data) {
        const billingPlan = await this.planRepository.findAll({});

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async createFeature(data) {
        const featureExists = await this.featureRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (featureExists) {
            throw new Error("This Feature already exists.");
        }

        const newFeature = await this.featureRepository.create(data);

        if (!newFeature) {
            throw new Error("Failed to create Feature");
        }

        return newFeature;
    }

    async updateFeature(data) {
        const feature = await this.featureRepository.findOne({ id: data.id })

        if (!feature) {
            throw new Error("Feature not found");
        }

        const update = await this.featureRepository.update(data.id, {
            name: data.name || feature.name,
            description: data.description || feature.description,
            price: data.price || feature.price,
            billingCycle: data.billingCycle || feature.billingCycle
        });

        if (!update) {
            throw new Error("Failed to update feature");
        }

        return update;
    }

    async getSingleFeature(data) {
        const feature = await this.featureRepository.findOne({ id: data.id });

        if (!feature) {
            throw new Error("Feature not found")
        }

        return feature;
    }

    async getAllFeature(data) {
        const feature = await this.featureRepository.findAll({});

        if (!feature) {
            throw new Error("Feature not found")
        }

        return feature;
    }

    async createPayment(data) {
        const paymentExists = await this.paymentRepository.findFirstDynamic({
            where: { tenantId: data.tenantId },
            select: { tenantId: true }
        });

        if (paymentExists) {
            throw new Error("This payment already exists.");
        }

        const newPayment = await this.paymentRepository.create(data);

        if (!newPayment) {
            throw new Error("Failed to create payment");
        }

        return newPayment;
    }

    async updatePayment(data) {
        const payment = await this.paymentRepository.findOne({ id: data.id })

        if (!payment) {
            throw new Error("payment not found");
        }

        const update = await this.paymentRepository.update(data.id, {
            paymentLink: data.paymentLink || payment.paymentLink
        });

        if (!update) {
            throw new Error("Failed to update payment");
        }

        return update;
    }

    async getSinglePayment(data) {
        const payment = await this.paymentRepository.findOne({ id: data.id });

        if (!payment) {
            throw new Error("Payment not found")
        }

        return payment;
    }

    async getAllPayment(data) {
        const payment = await this.paymentRepository.findAll({});

        if (!payment) {
            throw new Error("Payment not found")
        }

        return payment;
    }
}

export default BillingService;
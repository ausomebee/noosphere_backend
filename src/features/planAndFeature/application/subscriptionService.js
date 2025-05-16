class SubscriptionService {
    constructor({ subscriptionRepository }) {
        this.subscriptionRepository = subscriptionRepository;
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

}

export default SubscriptionService;
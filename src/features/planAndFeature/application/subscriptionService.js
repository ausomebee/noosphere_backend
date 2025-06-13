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
            status: data.status || subscription.status
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

    async getSubscriptionByPlan(planId) {
        const subscription = await this.subscriptionRepository.findAllAndPopulate({ planId }, { tenant: true });

        if (!subscription) {
            throw new Error("Subscriptions not found")
        }

        return subscription;
    }

    async getTotalSubscriptionByStatus() {
        const All = await this.subscriptionRepository.totalCount({});
        const ACTIVE = await this.subscriptionRepository.totalCount({ status: "ACTIVE" });
        const PAUSED = await this.subscriptionRepository.totalCount({ status: "PAUSED" });
        const PENDING = await this.subscriptionRepository.totalCount({ status: "PENDING" });
        const CANCELLED = await this.subscriptionRepository.totalCount({ status: "CANCELLED" });

        if (!All || !ACTIVE || !PAUSED || !PENDING || !CANCELLED) {
            throw new Error("Failed to count payment");
        }

        return { All, ACTIVE, PAUSED, PENDING, CANCELLED };
    }

    async getSubscriptionByStatus(status) {
        const query = status === "all" ? {} : { status }
        const subscriptions = await this.subscriptionRepository.findAllAndPopulate(query);

        if (!subscriptions) {
            throw new Error("subscriptions not found")
        }

        return subscriptions;
    }

}

export default SubscriptionService;
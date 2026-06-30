class SubscriptionService {
    constructor({ subscriptionRepository, tenantRepository }) {
        this.subscriptionRepository = subscriptionRepository;
        this.tenantRepository = tenantRepository;
    }

    async createSubscription(data) {
        const newSubscription = await this.subscriptionRepository.create(data);

        if (!newSubscription) {
            throw new Error("Failed to create subscription");
        }

        return newSubscription;
    }

    async updateSubscriptions(data) {
        const results = await Promise.all(
            data.id.map(async (id) => {
                const subscription = await this.subscriptionRepository.findOne({ id: id });

                if (!subscription) {
                    throw new Error(`Subscription with ID ${id} not found`);
                }

                const update = await this.subscriptionRepository.update(id, {
                    pauseSchedule: data.pauseSchedule || subscription.pauseSchedule,
                    status: data.status || subscription.status,
                    autoRenew: data.autoRenew ?? subscription.autoRenew,
                    resumeShedule: data.resumeShedule || subscription.resumeShedule,
                    mailNotification: data.mailNotification ?? subscription.mailNotification
                });

                if (!update) {
                    throw new Error(`Failed to update Subscription with ID ${id}`);
                }

                if (update.status === "PAUSED") {
                    if (!this.tenantRepository) {
                        throw new Error("Tenant repository is required to pause a subscription");
                    }

                    const tenant = await this.tenantRepository.update(update.tenantId, {
                        active: false,
                    });

                    if (!tenant) {
                        throw new Error(`Failed to deactivate tenant with ID ${update.tenantId}`);
                    }
                }

                return update;
            })
        );

        return results;
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
        const subscription = await this.subscriptionRepository.findAllAndPopulate({ planId });

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

    async getTenantSubscriptions(tenantId) {
        const subscriptions = await this.subscriptionRepository.getTenantSubscriptionsWithDetails(tenantId);

        if (!subscriptions) {
            throw new Error("Subscriptions not found for this tenant")
        }

        return subscriptions;
    }
}

export default SubscriptionService;

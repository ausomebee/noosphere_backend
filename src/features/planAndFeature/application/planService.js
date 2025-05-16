class PlanService {
    constructor({ planRepository }) {
        this.planRepository = planRepository;
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

}

export default PlanService;
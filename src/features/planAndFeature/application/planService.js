import Plan from "../domain/plan.js";
import argon2 from "argon2";

class PlanService {
    constructor({ planRepository, adminRepository }) {
        this.planRepository = planRepository;
        this.adminRepository = adminRepository;
    }

    async createBillingPlan(data) {
        const billingPlanExists = await this.planRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (billingPlanExists) {
            throw new Error("This billingPlan already exists.");
        }

        const planData = new Plan(data)
        const createData = data.planType === "ENTERPRISE" ? planData.createEnterpriseBillingPlan : planData.createStandardBillingPlan
        const newBillingPlan = await this.planRepository.create(createData);

        if (!newBillingPlan) {
            throw new Error("Failed to create BillingPlan");
        }

        return newBillingPlan;
    }

    async updateBillingPlan(data) {
        if (typeof data.active === 'boolean') {
            const superAdmin = await this.adminRepository.findFirst({ superAdmin: true })

            if (!superAdmin) {
                throw new Error("Super admin not found")
            }

            if (!(await argon2.verify(superAdmin.administratorPassword, data.administratorPassword))) {
                throw new Error('Incorrect password')
            }
        }

        const billingPlan = await this.planRepository.findOne({ id: data.id })

        if (!billingPlan) {
            throw new Error("BillingPlan not found");
        }

        const update = await this.planRepository.update(data.id, {
            name: data.name || billingPlan.name,
            description: data.description || billingPlan.description,
            planType: data.planType || billingPlan.planType,
            colourCode: data.colourCode || billingPlan.colourCode,
            pricePerMonth: data.pricePerMonth || billingPlan.pricePerMonth,
            pricePerYear: data.pricePerYear || billingPlan.pricePerYear,
            forClient: data.forClient || billingPlan.forClient,
            forStaff: data.forStaff || billingPlan.forStaff,
            forStorage: data.forStorage || billingPlan.forStorage,
            extraFeaturesEnabled: data.extraFeaturesEnabled || billingPlan.extraFeaturesEnabled,
            active: data.active ?? billingPlan.active,
            tenantId: data.tenantId || billingPlan.tenantId,
            adminId: data.adminId || billingPlan.adminId,
            features: data.features || billingPlan.features,
            extraFeatures: data.extraFeatures || billingPlan.extraFeatures,
            forStaff: data.forStaff || billingPlan.forStaff,
        });

        if (!update) {
            throw new Error("Failed to update Billing Plan");
        }

        return update;
    }

    async getSingleBillingPlan(data) {
        const billingPlan = await this.planRepository.findOne({ id: data.id });

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async getAllBillingPlan(data) {
        const billingPlan = await this.planRepository.findAllAndPopulate({}, {
            features: true,
            extraFeatures: true
        });

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async getBillingPlanByType(data) {
        const billingPlan = await this.planRepository.findAllAndPopulate({ planType: data }, {
            features: true,
            extraFeatures: true
        });

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        return billingPlan;
    }

    async duplicateBillingPlan(id) {
        const billingPlan = await this.planRepository.findOneToDuplicate({ id });

        if (!billingPlan) {
            throw new Error("BillingPlan not found")
        }

        const planData = new Plan({
            id: billingPlan.id,
            planType: billingPlan.planType,
            name: billingPlan.name + " " + "(Copy)",
            colourCode: billingPlan.colourCode,
            description: billingPlan.description,
            pricePerMonth: billingPlan.pricePerMonth,
            pricePerYear: billingPlan.pricePerYear,
            forClient: billingPlan.forClient,
            forStaff: billingPlan.forStaff,
            forStorage: billingPlan.forStorage,
            extraFeaturesEnabled: billingPlan.extraFeaturesEnabled,
            tenantId: billingPlan.tenantId,
            adminId: billingPlan.adminId,
            features: {
                connect: billingPlan.features.map((f) => ({ id: f.id })),
            },
            extraFeatures: {
                connect: billingPlan.extraFeatures.map((f) => ({ id: f.id })),
            },
        })

        const createData = billingPlan.planType === "ENTERPRISE" ? planData.createEnterpriseBillingPlan : planData.createStandardBillingPlan

        const duplicate = await this.planRepository.create(createData)

        if (!duplicate) {
            throw new Error("Failed to duplicate BillingPlan");
        }

        return duplicate;
    }

    async deleteBillingPlan(data) {
        const superAdmin = await this.adminRepository.findFirst({ superAdmin: true })

        if (!superAdmin) {
            throw new Error("Super admin not found")
        }

        if (!(await argon2.verify(superAdmin.administratorPassword, data.administratorPassword))) {
            throw new Error('Incorrect password')
        }

        const billingPlan = await this.planRepository.findOne({ id: data.id })

        if (!billingPlan) {
            throw new Error("BillingPlan not found");
        }

        const deleted = await this.planRepository.delete(data.id);

        if (!deleted) {
            throw new Error("Failed to delete Billing Plan");
        }

        return deleted;
    }
    
}

export default PlanService;
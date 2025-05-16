import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";
import Plan from "../../domain/plan.js";
import PlanService from "../../application/planService.js";

class PlanController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.planRepository = new PlanRepository(this.prisma.billingPlan);
        this.service = new PlanService({ planRepository: this.planRepository });
    }

    createBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlanData = new Plan(req.body);
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

}

export default PlanController;
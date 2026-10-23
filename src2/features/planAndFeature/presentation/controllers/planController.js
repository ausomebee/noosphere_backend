import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import PlanRepository from "../../../planAndFeature/infrastructure/planRepositiory.js";
import PlanService from "../../application/planService.js";
import AdminRepository from "../../../admin/infrastructure/adminRepository.js";

class PlanController {
    constructor() {
        this.prisma = prismaService.getClient()
        this.planRepository = new PlanRepository(this.prisma.billingPlan);
        this.adminRepository = new AdminRepository(this.prisma.admin);
        this.service = new PlanService({ planRepository: this.planRepository, adminRepository: this.adminRepository });
    }

    createBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.createBillingPlan(req.body);

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

    getBillingPlanByType = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.getBillingPlanByType(req.params.planType);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to fetch billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan fetched successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    duplicateBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.duplicateBillingPlan(req.params.id);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to duplicate billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan duplicated successfully",
            status: 'ok',
            data: billingPlan
        });
    });

    deleteBillingPlan = expressAsyncHandler(async (req, res) => {
        const billingPlan = await this.service.deleteBillingPlan(req.body);

        if (!billingPlan) {
            res.status(500).json({ message: 'Failed to delete billing Plan' });
        }

        return res.status(201).json({
            message: "billing Plan deleted successfully",
            status: 'ok',
            data: billingPlan
        });
    });

}

export default PlanController;
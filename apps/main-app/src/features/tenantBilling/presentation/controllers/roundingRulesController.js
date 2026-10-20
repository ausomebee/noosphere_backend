import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import RoundingRulesRepository from "../../infrastructure/roundingRulesRepository.js";
import RoundingRulesService from "../../application/roundingRulesService.js";
import RoundingRules from "../../domain/roundingRule.js";

class RoundingRulesController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.roundingRulesRepository = new RoundingRulesRepository(this.prisma.roundingRules);
        this.service = new RoundingRulesService({ roundingRulesRepository: this.roundingRulesRepository });
    }

    createRoundingRule = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const ruleData = new RoundingRules(data);
        const rule = await this.service.createRoundingRule(ruleData.createRoundingRule);

        if (!rule) {
            return res.status(500).json({ message: "Failed to create rounding rule" });
        }

        return res.status(201).json({
            message: "Rounding rule created successfully",
            status: "ok",
            data: rule
        });
    });

    updateRoundingRule = expressAsyncHandler(async (req, res) => {
        const rule = await this.service.updateRoundingRule(req.body);

        if (!rule) {
            return res.status(500).json({ message: "Failed to update rounding rule" });
        }

        return res.status(200).json({
            message: "Rounding rule updated successfully",
            status: "ok",
            data: rule
        });
    });

    getSingleRoundingRule = expressAsyncHandler(async (req, res) => {
        const rule = await this.service.getSingleRoundingRule(req.params);

        if (!rule) {
            return res.status(404).json({ message: "Rounding rule not found" });
        }

        return res.status(200).json({
            message: "Rounding rule fetched successfully",
            status: "ok",
            data: rule
        });
    });

    getTenantRoundingRules = expressAsyncHandler(async (req, res) => {
        const rules = await this.service.getTenantRoundingRules(req.params.tenantId);

        if (!rules) {
            return res.status(404).json({ message: "No rounding rules found" });
        }

        return res.status(200).json({
            message: "Rounding rules fetched successfully",
            status: "ok",
            data: rules
        });
    });

    deactivateRoundingRule = expressAsyncHandler(async (req, res) => {
        const rule = await this.service.updateRoundingRule({ id: req.params.id, isActive: req.params.active === "true" });

        if (!rule) {
            return res.status(500).json({ message: "Failed to deactivated rounding rule" });
        }

        return res.status(200).json({
            message: "Rounding rule deactivated successfully",
            status: "ok",
            data: rule
        });
    });
}

export default RoundingRulesController;

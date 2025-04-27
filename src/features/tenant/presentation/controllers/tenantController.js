import expressAsyncHandler from "express-async-handler";
import TenantService from "../../application/tenantService.js";
import Tenant from "../../domain/tenant.js";

class TenantController {
    constructor() {
        this.service = new TenantService();
    }

    createTenant = expressAsyncHandler(async (req, res) => {
        const tenantData = new Tenant(req.body);
        const tenant = await this.service.createTenant(tenantData);

        if (!tenant) {
            res.status(500).json({ message: 'Failed to create tenant' });
        }

        return res.status(201).json({
            message: "Tenant created successfully",
            status: 'ok',
            data: tenant
        });
    });

    createTenantStaff = expressAsyncHandler(async (req, res) => {
        const staffData = new Tenant(req.body);
        const staff = await this.service.createTenantStaff(staffData.createTenantStaff);

        if (!staff) {
            res.status(500).json({ message: 'Failed to create tenant staff' });
        }

        return res.status(201).json({
            message: "Tenant staff created successfully",
            status: 'ok',
            data: staff
        });
    });

    staffSignin = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.staffSignin(req.body);

        if (!staff) {
            res.status(500).json({ message: 'Failed to signin staff' });
        }

        return res.status(201).json({
            message: "staff login successfully",
            status: 'ok',
            data: staff
        });
    });

    getSingleStaff = expressAsyncHandler(async (req, res) => {
        const staff = await this.service.getSingleStaff(req.params);

        if (!staff) {
            res.status(500).json({ message: 'Failed to get staff' });
        }

        return res.status(201).json({
            message: "Staff fetched successfully",
            status: 'ok',
            data: staff
        });
    });
}

export default TenantController;
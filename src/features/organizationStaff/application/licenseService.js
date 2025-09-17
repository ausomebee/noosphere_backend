class LicenseService {
    constructor({ licenseRepository }) {
        this.licenseRepository = licenseRepository;
    }

    async updateLicense(data) {
        const license = await this.licenseRepository.findOne({ id: data.id });

        if (!license) {
            throw new Error("License not found");
        }

        const update = await this.licenseRepository.update(data.id, {
            licenseName: data.licenseName || license.licenseName,
            licenseNumber: data.licenseNumber || license.licenseNumber,
            tenantStaffId: data.tenantStaffId || license.tenantStaffId,
            issueState: data.issueState || license.issueState,
            expiryDate: data.expiryDate || license.expiryDate,
            isDeleted: data.isDeleted ?? tenant.isDeleted
        });

        if (!update) {
            throw new Error("Failed to update license");
        }

        return update;
    }

    async getTenantStaffLicenses(tenantStaffId) {
        const licenses = await this.licenseRepository.findAllAndPopulate({ tenantStaffId, active: true, isDeleted: false });

        if (!licenses) {
            throw new Error("Licenses not found");
        }

        return licenses;
    }

    async getLicense(id) {
        const license = await this.licenseRepository.findFirst({ id });

        if (!license) {
            throw new Error("License not found");
        }

        return license;
    }
}

export default LicenseService;
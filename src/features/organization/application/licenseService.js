class LicenseService {
    constructor({ licenseRepository }) {
        this.licenseRepository = licenseRepository;
    }

    async createLicense(data) {
        const licenseExists = await this.licenseRepository.findFirstDynamic({
            where: { name: data.name },
            select: { name: true }
        });

        if (licenseExists) {
            throw new Error("This license already exists.");
        }

        const newLicense = await this.licenseRepository.create(data);

        if (!newLicense) {
            throw new Error("Failed to create License");
        }

        return newLicense;
    }

    async updateLicense(data) {
        const license = await this.licenseRepository.findOne({ id: data.id })

        if (!license) {
            throw new Error("License not found");
        }

        const update = await this.licenseRepository.update(data.id, {
            tenantId: data.tenantId || license.tenantId,
            licenseName: data.licenseName || license.licenseName,
            licenseNumber: data.licenseNumber || license.licenseNumber,
            issueDate: data.issueDate || license.issueDate,
            expiryDate: data.expiryDate || license.expiryDate,
            isDeleted: data.isDeleted || license.isDeleted,
        });

        if (!update) {
            throw new Error("Failed to update License");
        }

        return update;
    }

    async getSingleLicense(data) {
        const license = await this.licenseRepository.findOne({ id: data.id });

        if (!license) {
            throw new Error("License not found")
        }

        return license;
    }

    async getTenantLicenses(tenantId) {
        const licenses = await this.licenseRepository.findAll({ tenantId });

        if (!licenses) {
            throw new Error("Licenses not found")
        }

        return licenses;
    }

}

export default LicenseService;
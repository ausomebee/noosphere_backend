import DepartmentRepository from '../infrastructure/departmentRepository.js';

class DepartmentService {
    constructor() {
        this.repository = new DepartmentRepository()
    }

    async createAdminDepartment(data) {
        const departmentExist = await this.repository.findFirst({
            OR: [
                { name: data.name },
                { module: "ADMIN" }
            ]
        });

        if (departmentExist) {
            throw new Error("This dpartment already exists.");
        }

        const newDepartment = await this.repository.create(data);

        if (!newDepartment) {
            throw new Error("Failed to create department");
        }

        return newDepartment;
    }

    async createTenantDepartment(data) {
        const departmentExist = await this.repository.findFirst({
            OR: [
                { name: data.name },
                { module: "TENANT" },
                { createdByTenantId: data.tenantId }
            ]
        });

        if (departmentExist) {
            throw new Error("This dpartment already exists.");
        }

        const newDepartment = await this.repository.create(data);

        if (!newDepartment) {
            throw new Error("Failed to create department");
        }

        return newDepartment;
    }

    async createClientDepartment(data) {
        const departmentExist = await this.repository.findFirst({
            OR: [
                { name: data.name },
                { module: "CLIENT" },
                { createdByTenantId: data.tenantId }
            ]
        });

        if (departmentExist) {
            throw new Error("This dpartment already exists.");
        }

        const newDepartment = await this.repository.create(data);

        if (!newDepartment) {
            throw new Error("Failed to create department");
        }

        return newDepartment;
    }
}

export default DepartmentService;
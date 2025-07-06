import DepartmentRepository from '../infrastructure/departmentRepository.js';

class DepartmentService {
    constructor() {
        this.repository = new DepartmentRepository()
    }

    async createAdminDepartment(data) {
        const departmentExist = await this.repository.findFirst({
            AND: [
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

    async getAdminDepartments() {
        const department = await this.repository.findAll({module: "ADMIN"});

        if (!department) {
            throw new Error("Failed to fetch department");
        }

        return department;
    }

    async tenantCreateDepartment(data) {
        console.log(data)
        const departmentExist = await this.repository.findFirst({
            AND: [
                { name: data.name },
                { module: "TENANT" },
                { createdByTenantId: data.createdByTenantId }
            ]
        });

        if (departmentExist) {
            throw new Error("This department already exists.");
        }

        const newDepartment = await this.repository.create(data);

        if (!newDepartment) {
            throw new Error("Failed to create department");
        }

        return newDepartment;
    }

    async tenantGetDepartments(data) {
        const department = await this.repository.findAll({module: data.module, createdByTenantId: data.createdByTenantId});

        if (!department) {
            throw new Error("Failed to fetch department");
        }

        return department;
    }

    // async createClientDepartment(data) {
    //     const departmentExist = await this.repository.findFirst({
    //         OR: [
    //             { name: data.name },
    //             { module: "CLIENT" },
    //             { createdByTenantId: data.tenantId }
    //         ]
    //     });

    //     if (departmentExist) {
    //         throw new Error("This dpartment already exists.");
    //     }

    //     const newDepartment = await this.repository.create(data);

    //     if (!newDepartment) {
    //         throw new Error("Failed to create department");
    //     }

    //     return newDepartment;
    // }

    // async getClientDepartments(data) {
    //     const department = await this.repository.findAll({module: "CLIENT", createdByTenantId: data.createdByTenantId});

    //     if (!department) {
    //         throw new Error("Failed to fetch department");
    //     }

    //     return department;
    // }
}

export default DepartmentService;
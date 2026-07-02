class DepartmentService {
    constructor({ departmentRepository }) {
        this.departmentRepository = departmentRepository;
    }

    async createDepartment(data) {
        const exists = await this.departmentRepository.findFirstDynamic({
            where: {
                name: data.name,
                isDeleted: false
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Department with this name already exists.");
        }

        const newRecord = await this.departmentRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Department.");
        }

        return newRecord;
    }

    async updateDepartment(data) {
        const record = await this.departmentRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Department not found");
        }

        const updated = await this.departmentRepository.update(data.id, {
            name: data.name || record.name,
            createdByAdminId: data.createdByAdminId ?? record.createdByAdminId,
            teamLeadId: data.teamLeadId || record.teamLeadId,
            isActive: data.isActive ?? record.isActive,
            isDeleted: data.isDeleted ?? record.isDeleted
        });

        if (!updated) {
            throw new Error("Failed to update Department");
        }

        return updated;
    }

    async getSingleDepartment(id) {
        const record = await this.departmentRepository.findOne({ id });

        if (!record) {
            throw new Error("Department not found");
        }

        return record;
    }

    async getDepartments(query = {}) {
        const records = await this.departmentRepository.findAllAndPopulate({
            ...query,
            isDeleted: false
        },
            {
                teamLead: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                departmentMembers: {
                    select: {
                        admin: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        departmentMembers: true
                    }
                }
            }
        );

        if (!records) {
            throw new Error("Departments not found");
        }

        return records;
    }

}

export default DepartmentService;

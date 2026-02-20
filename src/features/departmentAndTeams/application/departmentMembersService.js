class DepartmentMembersService {
    constructor({ departmentMembersRepository }) {
        this.departmentMembersRepository = departmentMembersRepository;
    }

    async createDepartmentMember(data) {
        console.log(data)
        const exists = await this.departmentMembersRepository.findFirstDynamic({
            where: {
                departmentId: data.departmentId,
                staffId: data.staffId
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Staff is already a member of this department.");
        }

        const newRecord = await this.departmentMembersRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to add Department Member.");
        }

        return newRecord;
    }

    async removeDepartmentMember(id) {
        const record = await this.departmentMembersRepository.findOne({ id });

        if (!record) {
            throw new Error("Department Member not found");
        }

        return await this.departmentMembersRepository.delete(id);
    }

    async getDepartmentMembers(departmentId) {
        return await this.departmentMembersRepository.findAll({ departmentId });
    }
}

export default DepartmentMembersService;

class DepartmentMembers {
    constructor({ id, departmentId, adminId }) {
        this.id = id;
        this.departmentId = departmentId;
        this.adminId = adminId;
    }

    get createDepartmentMember() {
        return {
            departmentId: this.departmentId,
            adminId: this.adminId
        };
    }
}

export default DepartmentMembers;

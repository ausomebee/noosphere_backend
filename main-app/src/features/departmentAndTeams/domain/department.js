class Department {
    constructor({ id, name, createdByAdminId, teamLeadId }) {
        this.id = id;
        this.name = name;
        this.createdByAdminId = createdByAdminId;
        this.teamLeadId = teamLeadId;
    }

    get createDepartment() {
        return {
            name: this.name,
            createdByAdminId: this.createdByAdminId,
            teamLeadId: this.teamLeadId
        };
    }

    get updateDepartment() {
        return {
            id: this.id,
            name: this.name,
            createdByAdminId: this.createdByAdminId,
            teamLeadId: this.teamLeadId
        };
    }
}

export default Department;

class Teams {
    constructor({ id, name, tenantId, teamLeadId }) {
        this.id = id;
        this.name = name;
        this.tenantId = tenantId;
        this.teamLeadId = teamLeadId;
    }

    get createTeam() {
        return {
            name: this.name,
            tenantId: this.tenantId,
            teamLeadId: this.teamLeadId
        };
    }

    get updateTeam() {
        return {
            id: this.id,
            name: this.name,
            tenantId: this.tenantId,
            teamLeadId: this.teamLeadId
        };
    }
}

export default Teams;

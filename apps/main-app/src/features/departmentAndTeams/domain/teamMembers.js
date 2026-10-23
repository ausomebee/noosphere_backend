class TeamMembers {
    constructor({ id, teamId, staffId }) {
        this.id = id;
        this.teamId = teamId;
        this.staffId = staffId;
    }

    get createTeamMember() {
        return {
            teamId: this.teamId,
            staffId: this.staffId
        };
    }
}

export default TeamMembers;

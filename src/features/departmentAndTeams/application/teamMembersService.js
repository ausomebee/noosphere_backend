class TeamMembersService {
    constructor({ teamMembersRepository }) {
        this.teamMembersRepository = teamMembersRepository;
    }

    async createTeamMember(data) {
        const exists = await this.teamMembersRepository.findFirstDynamic({
            where: {
                teamId: data.teamId,
                staffId: data.staffId
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Staff is already a member of this team.");
        }

        const newRecord = await this.teamMembersRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to add Team Member.");
        }

        return newRecord;
    }

    async removeTeamMember(id) {
        // `id` is the TeamMembers record ID. A staff member can belong to more
        // than one team, so staffId cannot be used as a unique lookup key.
        const record = await this.teamMembersRepository.findOne({ id });

        if (!record) {
            throw new Error("Team Member not found");
        }

        return await this.teamMembersRepository.delete(id);
    }

    async getTeamMembers(teamId) {
        return await this.teamMembersRepository.findAll({ teamId });
    }
}

export default TeamMembersService;

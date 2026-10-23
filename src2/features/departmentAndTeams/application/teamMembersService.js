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

    async removeTeamMember(staffId) {
        const record = await this.teamMembersRepository.findOne({ staffId });

        if (!record) {
            throw new Error("Team Member not found");
        }

        return await this.teamMembersRepository.delete(record.id);
    }

    async getTeamMembers(teamId) {
        return await this.teamMembersRepository.findAll({ teamId });
    }
}

export default TeamMembersService;

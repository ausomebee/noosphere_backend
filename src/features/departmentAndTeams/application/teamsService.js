import { is } from "date-fns/locale";

class TeamsService {
    constructor({ teamsRepository }) {
        this.teamsRepository = teamsRepository;
    }

    async createTeam(data) {
        const exists = await this.teamsRepository.findFirstDynamic({
            where: {
                name: data.name,
                tenantId: data.tenantId
            },
            select: { id: true }
        });

        if (exists) {
            throw new Error("Team with this name already exists for this tenant.");
        }

        const newRecord = await this.teamsRepository.create(data);

        if (!newRecord) {
            throw new Error("Failed to create Team.");
        }

        return newRecord;
    }

    async updateTeam(data) {
        const record = await this.teamsRepository.findOne({ id: data.id });

        if (!record) {
            throw new Error("Team not found");
        }

        const updated = await this.teamsRepository.update(data.id, {
            name: data.name || record.name,
            teamLeadId: data.teamLeadId || record.teamLeadId,
            isActive: data.isActive ?? record.isActive,
            isDeleted: data.isDeleted ?? record.isDeleted
        });

        if (!updated) {
            throw new Error("Failed to update Team");
        }

        return updated;
    }

    async getSingleTeam(id) {
        const record = await this.teamsRepository.findOne({ id });

        if (!record) {
            throw new Error("Team not found");
        }

        return record;
    }

    async getTeams(query = {}) {
        return await this.teamsRepository.findAllAndPopulate(query, {
            teamLead: {
                select: {
                    id: true,
                    fullName: true,
                }
            },
            teamMembers: {
                select: {
                    staff: {
                        select: {
                            id: true,
                            fullName: true,
                        }
                    }
                }
            },
            _count: {
                select: {
                    teamMembers: true
                }
            }
        });
    }
}

export default TeamsService;

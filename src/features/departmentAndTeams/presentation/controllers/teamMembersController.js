import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TeamMembersService from "../../application/teamMembersService.js";
import TeamMembers from "../../domain/teamMembers.js";
import TeamMembersRepository from "../../infrastructure/teamMembersRepository.js";

class TeamMembersController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.teamMembersRepository = new TeamMembersRepository(
            this.prisma.teamMembers
        );
        this.service = new TeamMembersService({
            teamMembersRepository: this.teamMembersRepository
        });
    }

    createTeamMember = expressAsyncHandler(async (req, res) => {
        const data = new TeamMembers(req.body);

        const newRecord = await this.service.createTeamMember(
            data.createTeamMember
        );

        if (!newRecord) {
            return res.status(500).json({ message: "Failed to add team member" });
        }

        return res.status(201).json({
            message: "Team member added successfully",
            status: "ok",
            data: newRecord
        });
    });

    removeTeamMember = expressAsyncHandler(async (req, res) => {
        const removed = await this.service.removeTeamMember(req.params.id);

        if (!removed) {
            return res.status(500).json({ message: "Failed to remove team member" });
        }

        return res.status(200).json({
            message: "Team member removed successfully",
            status: "ok",
            data: removed
        });
    });

    getTeamMembers = expressAsyncHandler(async (req, res) => {
        const records = await this.service.getTeamMembers(req.params.teamId);

        if (!records) {
            return res.status(500).json({ message: "Failed to fetch team members" });
        }

        return res.status(200).json({
            message: "Team members fetched successfully",
            status: "ok",
            data: records
        });
    });
}

export default TeamMembersController;

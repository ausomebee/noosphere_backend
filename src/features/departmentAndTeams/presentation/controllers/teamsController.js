import expressAsyncHandler from "express-async-handler";
import prismaService from "../../../../config/prisma.js";
import TeamsRepository from "../../infrastructure/teamsRepository.js";
import TeamsService from "../../application/teamsService.js";
import Team from "../../domain/teams.js";
import TeamMembers from "../../domain/teamMembers.js";
import TeamMembersService from "../../application/teamMembersService.js";
import TeamMembersRepository from "../../infrastructure/teamMembersRepository.js";

class TeamsController {
    constructor() {
        this.prisma = prismaService.getClient();
        this.teamsRepository = new TeamsRepository(
            this.prisma.teams
        );
        this.service = new TeamsService({
            teamsRepository: this.teamsRepository
        });
        this.teamMembersRepository = new TeamMembersRepository(
            this.prisma.teamMembers
        );
        this.teamMembersService = new TeamMembersService({
            teamMembersRepository: this.teamMembersRepository
        });
    }

    createTeam = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const { members = [] } = data;

        const teamData = new Team(data);

        const team = await this.service.createTeam(
            teamData.createTeam
        );

        if (!team) {
            return res.status(500).json({
                message: "Failed to create team"
            });
        }

        for (const staffId of members) {
            const teamMemberInstance = new TeamMembers({
                teamId: team.id,
                staffId
            });

            const teamMember =
                await this.teamMembersService.createTeamMember(
                    teamMemberInstance.createTeamMember
                );

            if (!teamMember) {
                console.error(`Failed to create team member for staff ${staffId}`);
                continue;
            }
        }

        return res.status(201).json({
            message: "Team created successfully",
            status: "ok",
            data: team
        });
    });

    updateTeam = expressAsyncHandler(async (req, res) => {
        const data = req.body;
        const { members = [], id } = data;

        const team = await this.service.updateTeam(data);

        if (!team) {
            return res.status(500).json({
                message: "Failed to update team"
            });
        }

        if (members) {
            const existingMembers =
                await this.teamMembersService.getTeamMembers(id);

            const existingStaffIds = existingMembers.map(m => m.staffId);

            const membersToAdd = members.filter(
                staffId => !existingStaffIds.includes(staffId)
            );

            const membersToRemove = existingStaffIds.filter(
                staffId => !members.includes(staffId)
            );

            for (const staffId of membersToAdd) {
                const teamMemberInstance = new TeamMembers({
                    teamId: id,
                    staffId
                });

                await this.teamMembersService.createTeamMember(
                    teamMemberInstance.createTeamMember
                );
            }

            for (const staffId of membersToRemove) {
                const membership = existingMembers.find(
                    (member) => member.staffId === staffId
                );
                await this.teamMembersService.removeTeamMember(membership.id);
            }
        }

        return res.status(200).json({
            message: "Team updated successfully",
            status: "ok",
            data: team
        });
    });


    getSingleTeam = expressAsyncHandler(async (req, res) => {
        const team = await this.service.getSingleTeam(
            req.params.id
        );

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        return res.status(200).json({
            message: "Team fetched successfully",
            status: "ok",
            data: team
        });
    });

    getTeams = expressAsyncHandler(async (req, res) => {
        const teams = await this.service.getTeams(
            req.query
        );

        if (!teams) {
            return res.status(404).json({
                message: "No teams found"
            });
        }

        return res.status(200).json({
            message: "Teams fetched successfully",
            status: "ok",
            data: teams
        });
    });

    updateTeamActiveStatus = expressAsyncHandler(async (req, res) => {
        const team = await this.service.updateTeam({
            id: req.params.id,
            isActive: req.params.active === "true"
        });

        if (!team) {
            return res.status(500).json({
                message: "Failed to deactivate team"
            });
        }

        return res.status(200).json({
            message: "Team deactivated successfully",
            status: "ok",
            data: team
        });
    });

    deleteTeam = expressAsyncHandler(async (req, res) => {
        const team = await this.service.updateTeam({
            id: req.params.id,
            isDeleted: true
        });

        if (!team) {
            return res.status(500).json({
                message: "Failed to delete team"
            });
        }

        return res.status(200).json({
            message: "Team deleted successfully",
            status: "ok",
            data: team
        });
    });
}

export default TeamsController;

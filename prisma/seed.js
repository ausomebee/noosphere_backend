import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const pipelineCount = await prisma.pipeline.count();
    if (pipelineCount === 0) {
        await prisma.pipeline.create({
            module: "ADMIN",
            name: "Client Onboarding",
            description: "Manage your client intake process seamlessly"
        });

        console.log("Initial pipeline seeded");
    } else {
        console.log("Pipeline already exist, skipping seed");
    }

    const featureGroup = await prisma.featureGroup.count();
    if (featureGroup === 0) {
        console.log("Seeding feature groups and features...");

        const core = await prisma.featureGroup.create({
            data: {
                name: "CORE FEATURES",
                active: true
            }
        });

        const advanced = await prisma.featureGroup.create({
            data: {
                name: "ADVANCED FEATURES",
                active: true
            }
        });

        const customization = await prisma.featureGroup.create({
            data: {
                name: "CUSTOMIZATIONS & ADD-ONS",
                active: true
            }
        });

        const extra = await prisma.featureGroup.create({
            data: {
                name: "EXTRA FEATURES",
                active: true
            }
        });

        await prisma.feature.createMany({
            data: [
                // CORE FEATURES
                {
                    name: "Appointment & Scheduling",
                    description: "This is Appointment & Scheduling",
                    featureGroupId: core.id,
                    managedBy: "Spyware Team"
                },
                {
                    name: "Client Management",
                    description: "This is Client Management",
                    featureGroupId: core.id,
                    managedBy: "Super Graft"
                },
                {
                    name: "Staff Management",
                    description: "This is Staff Management",
                    featureGroupId: core.id,
                    managedBy: "Core Dev"
                },
                {
                    name: "Basic Reporting",
                    description: "This is Basic Reporting",
                    featureGroupId: core.id,
                    managedBy: "Fin giants"
                },
                {
                    name: "Billing & Invoicing",
                    description: "This is Billing & Invoicing",
                    featureGroupId: core.id,
                    managedBy: "Aces League"
                },

                // ADVANCED FEATURES
                {
                    name: "In-App Messaging",
                    description: "This is In-App Messaging",
                    featureGroupId: advanced.id,
                    managedBy: "Spyware Team"
                },
                {
                    name: "Pipeline Manager",
                    description: "This is Pipeline Manager",
                    featureGroupId: advanced.id,
                    managedBy: "Super Graft"
                },
                {
                    name: "Custom Forms",
                    description: "This is Custom Forms",
                    featureGroupId: advanced.id,
                    managedBy: "Core Dev"
                },
                {
                    name: "Document Request Manager",
                    description: "This is Document Request Manager",
                    featureGroupId: advanced.id,
                    managedBy: "Fin giants"
                },
                {
                    name: "Authorization Management",
                    description: "This is Authorization Management",
                    featureGroupId: advanced.id,
                    managedBy: "Aces League"
                },
                {
                    name: "Advanced Reporting",
                    description: "This is Advanced Reporting",
                    featureGroupId: advanced.id,
                    active: false,
                    managedBy: "Aces League"
                },
                {
                    name: "Data Collection & Analysis",
                    description: "This is Data Collection & Analysis",
                    featureGroupId: advanced.id,
                    managedBy: "Aces League"
                },

                // CUSTOMIZATION
                {
                    name: "Custom Branding",
                    description: "This is Custom Branding",
                    featureGroupId: customization.id,
                    managedBy: "Spyware Team"
                },
                {
                    name: "API Access",
                    description: "This is API Access",
                    featureGroupId: customization.id,
                    managedBy: "Super Graft"
                },
                {
                    name: "Third Party Integration",
                    description: "This is Third Party Integration",
                    featureGroupId: customization.id,
                    active: false,
                    managedBy: "Core Dev"
                },

                // EXTRA
                {
                    name: "Email Support",
                    description: "This is Email Support",
                    featureGroupId: extra.id,
                    managedBy: "Spyware Team"
                },
                {
                    name: "Priority Support",
                    description: "This is Priority Support",
                    featureGroupId: extra.id,
                    managedBy: "Super Graft"
                },
                {
                    name: "Dedicated Account Manager",
                    description: "This is Dedicated Account Manager",
                    featureGroupId: extra.id,
                    managedBy: "Core Dev"
                },
                {
                    name: "SLA Backed Uptime",
                    description: "This is SLA Backed Uptime",
                    featureGroupId: extra.id,
                    managedBy: "Core Dev"
                }
            ]
        });

        console.log("Feature seed completed");
    } else {
        console.log("Feature groups already seeded. Skipping...");
    }

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
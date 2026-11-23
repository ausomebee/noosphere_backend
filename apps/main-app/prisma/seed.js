import 'dotenv/config';
import prismaService from '../src/config/prisma.js';
const prisma = prismaService.getClient();

const featureGroupSeeds = [
    {
        name: "CORE FEATURES",
        features: [
            { name: "Appointment & Scheduling", description: "This is Appointment & Scheduling", managedBy: "Spyware Team" },
            { name: "Client Management", description: "This is Client Management", managedBy: "Super Graft" },
            { name: "Staff Management", description: "This is Staff Management", managedBy: "Core Dev" },
            { name: "Basic Reporting", description: "This is Basic Reporting", managedBy: "Fin giants" },
            { name: "Billing & Invoicing", description: "This is Billing & Invoicing", managedBy: "Aces League" }
        ]
    },
    {
        name: "ADVANCED FEATURES",
        features: [
            { name: "In-App Messaging", description: "This is In-App Messaging", managedBy: "Spyware Team" },
            { name: "Pipeline Manager", description: "This is Pipeline Manager", managedBy: "Super Graft" },
            { name: "Custom Forms", description: "This is Custom Forms", managedBy: "Core Dev" },
            { name: "Document Request Manager", description: "This is Document Request Manager", managedBy: "Fin giants" },
            { name: "Authorization Management", description: "This is Authorization Management", managedBy: "Aces League" },
            { name: "Advanced Reporting", description: "This is Advanced Reporting", active: false, managedBy: "Aces League" },
            { name: "Data Collection & Analysis", description: "This is Data Collection & Analysis", managedBy: "Aces League" }
        ]
    },
    {
        name: "CUSTOMIZATIONS & ADD-ONS",
        features: [
            { name: "Custom Branding", description: "This is Custom Branding", managedBy: "Spyware Team" },
            { name: "API Access", description: "This is API Access", managedBy: "Super Graft" },
            { name: "Third Party Integration", description: "This is Third Party Integration", active: false, managedBy: "Core Dev" }
        ]
    },
    {
        name: "EXTRA FEATURES",
        features: [
            { name: "Email Support", description: "This is Email Support", managedBy: "Spyware Team" },
            { name: "Priority Support", description: "This is Priority Support", managedBy: "Super Graft" },
            { name: "Dedicated Account Manager", description: "This is Dedicated Account Manager", managedBy: "Core Dev" },
            { name: "SLA Backed Uptime", description: "This is SLA Backed Uptime", managedBy: "Core Dev" }
        ]
    }
];

async function seedPipeline() {
    const existing = await prisma.pipeline.findFirst({
        where: { module: "TENANT", name: "Client Onboarding" }
    });

    if (existing) {
        console.log("Client Onboarding pipeline already exists; skipping");
        return;
    }

    await prisma.pipeline.create({
        data: {
            module: "TENANT",
            name: "Client Onboarding",
            description: "Manage your client intake process seamlessly"
        }
    });
    console.log("Initial pipeline seeded");
}

async function seedFeatureGroups() {
    for (const groupSeed of featureGroupSeeds) {
        let group = await prisma.featureGroup.findFirst({
            where: { name: groupSeed.name }
        });

        if (!group) {
            group = await prisma.featureGroup.create({
                data: { name: groupSeed.name, active: true }
            });
            console.log(`Feature group "${groupSeed.name}" seeded`);
        }

        for (const featureSeed of groupSeed.features) {
            const existing = await prisma.feature.findFirst({
                where: {
                    name: featureSeed.name,
                    featureGroupId: group.id
                }
            });

            if (existing) {
                continue;
            }

            await prisma.feature.create({
                data: { ...featureSeed, featureGroupId: group.id }
            });
            console.log(`Feature "${featureSeed.name}" seeded`);
        }
    }
}

async function main() {
    await seedPipeline();
    await seedFeatureGroups();
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
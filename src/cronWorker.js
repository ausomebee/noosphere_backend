import "./config/env.js";
import prismaService from "./config/prisma.js";
import cronScheduler from "./cron/scheduler.js";

async function startCronWorker() {
    try {
        await prismaService.connect();
        console.log("✅ Cron worker connected to database");

        cronScheduler.start();
        console.log("✅ Cron worker started");
    } catch (error) {
        console.error("❌ Failed to start cron worker:", error);
        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    try {
        await prismaService.disconnect();
    } finally {
        process.exit(0);
    }
});

process.on("SIGTERM", async () => {
    try {
        await prismaService.disconnect();
    } finally {
        process.exit(0);
    }
});

startCronWorker();

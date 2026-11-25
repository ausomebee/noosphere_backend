module.exports = {
    apps: [
        {
            name: "noosphere-backend",
            script: "npm",
            args: "run start",
            cwd: __dirname,
            autorestart: true,
        },
        {
            name: "noosphere-worker",
            script: "npm",
            args: "run start:worker",
            cwd: __dirname,
            autorestart: true,
        },
    ],
};

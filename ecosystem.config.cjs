module.exports = {
    apps: [
        {
            name: "noosphere-backend",
            script: "apps/main-app/src/server.js",
            autorestart: true,
        },
        {
            name: "noosphere-worker",
            script: "apps/main-app/src/cronWorker.js",
            autorestart: true,
        },
    ],
};

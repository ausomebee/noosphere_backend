# Noosphere Backend Nx Workspace

The repository contains two Nx projects:

- `main-app`: the existing API, scheduled job worker, and Prisma setup
- `cache-service`: a Redis-backed lock service, intended to run separately from the API servers

## Run locally

Start the API with `npm run server` (development) or `npm start`.

Start the cron worker with `npm run worker` (development) or `npm run start:worker`.

Start the cache service with `npm run start:cache`. Nx equivalents are `npx nx show projects`, `npx nx run main-app:serve`, `npx nx run main-app:worker`, and `npx nx run cache-service:serve`.

## Distributed cron locks

The cron worker acquires a separate Redis lease for each scheduled job through the cache service. A worker that cannot reach the service or acquire its lock skips that run. Redis performs atomic acquire (`SET NX PX`), renew, and owner-checked release (Lua scripts). The worker renews its lease while the job runs; expired leases are released automatically if a worker crashes.

Configure the cache service:

- `REDIS_URL`: Redis connection URL (`rediss://` for TLS where supported)
- `CACHE_SERVICE_TOKEN`: random shared bearer token of at least 32 characters
- `CACHE_SERVICE_PORT`: optional listen port, defaults to `3333` (falls back to `PORT` if unset)

Configure the API/worker hosts:

- `CACHE_SERVICE_URL`: base URL of the separately deployed cache service, preferably on a private network over HTTPS
- `CACHE_SERVICE_TOKEN`: the same secret configured on the cache service
- `CRON_LOCK_TTL_MS`: optional lease duration, defaults to `120000` ms (service accepts 30000–600000 ms)

Keep the cache service and Redis reachable only from trusted application/worker networks. Do not expose the bearer token in browser code. Multiple cache-service instances can share the same Redis backend. For availability, Redis itself must also be managed or deployed with appropriate persistence/failover; the HTTP service alone does not provide cache durability.

The lock prevents concurrent workers from normally running the same job, but a worker that pauses longer than its lease may continue after another worker acquires the expired lock. Jobs that create invoices, collect payments, or send notifications should remain idempotent and tolerate retries.

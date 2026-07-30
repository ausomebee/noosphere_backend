# noosphere_template
This is the Noosphere Repository Template

## Run API And Cron Worker Separately

- API server (dev): `npm run server`
- Cron worker (dev): `npm run worker`
- API server (prod): `npm run start`
- Cron worker (prod): `npm run start:worker`

The cron worker starts all scheduled jobs from `src/cron/scheduler.js` in a separate process.

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node apps/main-app/prisma/seed.js',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})

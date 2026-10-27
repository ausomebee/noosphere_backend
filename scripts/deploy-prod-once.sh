#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL must be set to the production database." >&2
  exit 1
fi

if [[ -n "${NODE_ENV:-}" && "$NODE_ENV" != "production" ]]; then
  echo "Refusing to deploy: NODE_ENV is '$NODE_ENV', expected 'production'." >&2
  exit 1
fi
export NODE_ENV=production

echo "This will generate Prisma Client, apply pending production migrations, and run the production seed."
if [[ "${DEPLOY_PROD_ON_STARTUP:-}" != "1" ]]; then
  if [[ ! -t 0 ]]; then
    echo "Run this one-time production script from an interactive terminal." >&2
    exit 1
  fi

  read -r -p "Type 'deploy production' to continue: " confirmation
  if [[ "$confirmation" != "deploy production" ]]; then
    echo "Deployment cancelled."
    exit 1
  fi
fi

npm run deploy

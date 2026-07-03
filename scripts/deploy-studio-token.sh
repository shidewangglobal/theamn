#!/bin/bash
# Deploy Sanity Studio without browser login (uses token from .env)
# Requires SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN in .env
# Create token: sanity.io/manage → project → API → Tokens → Deploy Studio

set -e
cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export SANITY_AUTH_TOKEN="${SANITY_AUTH_TOKEN:-$SANITY_API_WRITE_TOKEN}"
export SANITY_STUDIO_PROJECT_ID="${SANITY_STUDIO_PROJECT_ID:-$PUBLIC_SANITY_PROJECT_ID}"
export SANITY_STUDIO_DATASET="${SANITY_STUDIO_DATASET:-${PUBLIC_SANITY_DATASET:-production}}"
export PUBLIC_SANITY_PROJECT_ID="${PUBLIC_SANITY_PROJECT_ID:-$SANITY_STUDIO_PROJECT_ID}"
export PUBLIC_SANITY_DATASET="${PUBLIC_SANITY_DATASET:-$SANITY_STUDIO_DATASET}"

if [ -z "$SANITY_AUTH_TOKEN" ]; then
  echo "Missing SANITY_AUTH_TOKEN in .env"
  echo "Create one at sanity.io/manage → API → Tokens (Deploy Studio permission)"
  exit 1
fi

echo "Deploying Studio to https://theamn.sanity.studio ..."
npx sanity deploy --yes

echo ""
echo "✓ Done: https://theamn.sanity.studio"

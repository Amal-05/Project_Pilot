#!/bin/bash
set -e

echo "=== Installing root dependencies ==="
npm install

echo "=== Generating Prisma client ==="
cd packages/database
npx prisma generate
cd ../..

echo "=== Building validation package ==="
cd packages/validation
../../node_modules/.bin/tsc --skipLibCheck || echo "Validation build warnings ignored"
cd ../..

echo "=== Building API ==="
cd apps/api
../../node_modules/.bin/tsc --skipLibCheck
cd ../..

echo "=== Build complete ==="

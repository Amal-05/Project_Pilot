# ProjectPilot Deployment Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (if not using Docker)
- OpenAI API Key
- Google OAuth Credentials (for social login)

## Quick Start (Docker)
1. Clone the repository.
2. Create a `.env` file in the root based on `.env.example`.
3. Run `docker-compose up --build`.
4. Access the app at `http://localhost:3000` and the API at `http://localhost:4000`.

## Manual Setup
### Backend
1. `cd apps/api`
2. `npm install`
3. `npm run dev`

### Frontend
1. `cd apps/web`
2. `npm install`
3. `npm run dev`

## Database Migrations
Run the following from the root to sync your database:
```bash
npx turbo run db:push --filter=@project-pilot/database
```

## Seeding Data
To populate the database with initial test data:
```bash
npx turbo run seed --filter=@project-pilot/database
```

## Testing
### Unit Tests (API)
```bash
npx turbo run test --filter=@project-pilot/api
```

### E2E Tests (Web)
```bash
cd apps/web
npx playwright test
```

## Production Deployment
For production, it is recommended to:
1. Use a managed database service (e.g., AWS RDS, Supabase).
2. Use a managed Redis service (e.g., Upstash).
3. Deploy the API to a container service (e.g., AWS ECS, Google Cloud Run).
4. Deploy the Frontend to a static hosting or Vercel/Netlify.
5. Ensure all environment variables are correctly set in your CI/CD pipeline.

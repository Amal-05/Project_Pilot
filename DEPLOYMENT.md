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

## Production Deployment

### 1. Backend & Database (Render)
This project includes a `render.yaml` Blueprint file for one-click setup of the API, Database, and Redis.

1.  Log in to [Render](https://render.com).
2.  Go to the **Blueprints** section and click **New Blueprint Instance**.
3.  Connect your GitHub repository.
4.  Render will automatically detect the `render.yaml` and prompt you to create the services.
5.  **Important:** You will need to manually set these Environment Variables in the Render dashboard for `project-pilot-api`:
    - `OPENAI_API_KEY`: Your OpenAI API key.
    - `CLOUDINARY_URL`: Your Cloudinary connection string.
    - `FRONTEND_URL`: The URL of your deployed Vercel frontend.

### 2. Frontend (Vercel)
1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the following settings:
    - **Framework Preset:** Next.js
    - **Root Directory:** Leave as root (`/`).
    - **Build Command:** `npx turbo run build --filter=@project-pilot/web`
    - **Output Directory:** `apps/web/.next`
    - **Install Command:** `npm install`
5.  Add **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: Your Render API URL (e.g., `https://project-pilot-api.onrender.com/api/v1`)
    - `NEXT_PUBLIC_SOCKET_URL`: Your Render API URL (e.g., `https://project-pilot-api.onrender.com`)

### 3. Post-Deployment
Once the backend is up, you must run the database migrations and seed the initial data:
1.  In the Render dashboard, open the **Shell** for the `project-pilot-api` service.
2.  Run the following commands:
    ```bash
    npx prisma db push --schema=./prisma/schema.prisma
    npx ts-node ./prisma/seed.ts
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

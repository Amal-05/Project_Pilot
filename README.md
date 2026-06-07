# ProjectPilot

ProjectPilot is an enterprise-grade, AI-powered project management platform. It combines the power of modern task management (Kanban, Sprints) with real-time collaboration (Chat, Notifications) and advanced AI assistance (Task generation, Risk analysis).

## Features
- **Organization & Project Management**: Multi-tenant support with RBAC.
- **Real-time Kanban Board**: Interactive drag-and-drop task management.
- **Collaboration**: Instant messaging and project-wide notifications.
- **AI Integration**: Automatic task generation and project risk analysis using OpenAI GPT-4o.
- **Production Ready**: Dockerized setup, comprehensive testing, and API documentation.

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, ShadCN UI, Zustand, TanStack Query.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL with Prisma ORM.
- **Real-time**: Socket.io.
- **AI**: OpenAI API.
- **DevOps**: Docker, Docker Compose, Playwright (E2E), Jest (Unit).

## Getting Started
See the [Deployment Guide](./DEPLOYMENT.md) for detailed instructions on setting up the project locally and in production.

## API Documentation
Once the API is running, you can access the Swagger documentation at:
`http://localhost:4000/api-docs`

## License
MIT

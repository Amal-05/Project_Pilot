# ProjectPilot

ProjectPilot is a next-generation, enterprise-grade project management platform. It seamlessly blends robust task management features (like interactive Kanban boards and Sprint planning) with real-time collaboration tools (direct messaging, project chat rooms, and live notifications) and advanced AI assistance (automated task generation and project risk analysis).

Designed for modern engineering and product teams, ProjectPilot provides a unified command center to streamline operations, reduce project bottlenecks, and boost team velocity.

---

## Key Features

### 📋 Enterprise Task & Sprint Management
* **Interactive Kanban Board**: Drag-and-drop workflow tracking with swimlanes, custom status columns, and tags.
* **Sprint Cycles**: Plan sprint scopes, track team velocity, and view burndown metrics.
* **Granular Task Details**: Define dependencies, estimate hours, log checklists, and write inline comments.

### 💬 Real-Time Collaboration
* **Direct Messaging**: Connect with any organization member instantly.
* **Contextual Channels**: Automatic chat rooms generated per project and organization.
* **Push Notifications**: Live updates for task assignments, status changes, and team mentions.

### 🧠 Intelligent AI Assistant
* **AI Project & Task Generator**: Prompt the AI to build complete task backlogs and structures based on high-level goals.
* **Automated Risk Analysis**: Run risk analysis over task states and schedules to identify bottlenecks before they delay launch.

### 🔐 Enterprise-Grade Architecture
* **Multi-Tenancy**: Support for multiple organizations with clean data isolation.
* **Role-Based Access Control (RBAC)**: Assign managers, team members, or client roles with distinct system permissions.
* **Security First**: Input sanitization, CORS protection, secure token handling, and robust rate limiting.

---

## Tech Stack

* **Frontend**: Next.js 15, React 18, Tailwind CSS, Zustand, Axios.
* **Backend**: Node.js, Express.js, TypeScript (compiled to CommonJS for production reliability).
* **Database**: PostgreSQL with Prisma ORM.
* **Caching & Limits**: Redis.
* **Realtime Server**: Socket.io.

---

## Getting Started

### Local Development Setup

1. **Pre-requisites**: Ensure you have Node.js 18+, Docker, and PostgreSQL/Redis installed.
2. **Environment Configuration**: Create a `.env` file in the root based on `.env.example`.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Prisma Generation**:
   ```bash
   npx prisma generate --schema=./packages/database/prisma/schema.prisma
   ```
5. **Run Services**:
   ```bash
   npm run dev
   ```

---

## API Documentation

Once the backend is running, the Swagger API interactive documentation is available at:
`http://localhost:4000/api-docs`

---

## License

This project is licensed under the MIT License.

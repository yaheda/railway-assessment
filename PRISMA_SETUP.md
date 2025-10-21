# Prisma + Neon DB Setup Guide

## Overview
This project is now configured with Prisma ORM connected to Neon DB (PostgreSQL). The setup includes three main models: `User`, `Project`, and `Container`.

## Database Schema

### User Model
Synced with Clerk authentication
- `id`: Unique identifier (cuid)
- `clerkId`: Clerk user ID (unique)
- `email`: User email (unique)
- `name`: Optional user name
- `createdAt`, `updatedAt`: Timestamps

### Project Model
Organizes containers by project
- `id`: Unique identifier (cuid)
- `name`: Project name
- `userId`: Foreign key to User
- `createdAt`, `updatedAt`: Timestamps
- Relations: User (owner), Container[] (contained resources)

### Container Model
Manages individual deployments
- `id`: Unique identifier (cuid)
- `name`: Container name
- `status`: Current status (started, stopped, restarting)
- `image`: Docker image
- `port`: Optional port number
- `projectId`: Foreign key to Project
- `userId`: Foreign key to User (for quick access)
- `createdAt`, `updatedAt`: Timestamps
- Relations: Project, User

## Usage

### Import Prisma Client
```typescript
import { prisma } from '@/lib/prisma';
```

### Example Queries
```typescript
// Create a user
const user = await prisma.user.create({
  data: {
    clerkId: 'user_123',
    email: 'user@example.com',
    name: 'John Doe'
  }
});

// Create a project
const project = await prisma.project.create({
  data: {
    name: 'My Project',
    userId: user.id
  }
});

// Create a container
const container = await prisma.container.create({
  data: {
    name: 'api-server',
    status: 'started',
    image: 'node:18',
    port: 3000,
    projectId: project.id,
    userId: user.id
  }
});

// Query containers for a project
const containers = await prisma.container.findMany({
  where: { projectId: project.id },
  include: { project: true }
});
```

## Available Commands

```bash
# Start development server
npm run dev

# Run database migrations
npm run prisma:migrate

# Generate Prisma Client (auto-run on migrate)
npm run prisma:generate

# Open Prisma Studio (visual database explorer)
npm run prisma:studio

# Build for production
npm run build
```

## Prisma Client Configuration
The Prisma Client is configured as a singleton in `src/lib/prisma.ts` to prevent connection pool exhaustion in development. This is the recommended pattern for Next.js applications.

## Environment Variables
The `DATABASE_URL` environment variable in `.env` contains your Neon DB connection string. Keep this secure and never commit it to version control.

## Migrations
All database migrations are stored in `prisma/migrations/`. To create a new migration:

```bash
npm run prisma:migrate -- --name <migration_name>
```

For example:
```bash
npm run prisma:migrate -- --name add_deployment_status
```

## Next Steps
1. Integrate Prisma queries into your API routes and server components
2. Create API endpoints for CRUD operations on containers and projects
3. Add validation and error handling
4. Consider adding indices for frequently queried fields
5. Set up automatic backups for your Neon DB instance

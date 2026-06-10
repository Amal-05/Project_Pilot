import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './modules/auth/auth.routes';
import organizationRoutes from './modules/organization/organization.routes';
import projectRoutes from './modules/project/project.routes';
import taskRoutes from './modules/task/task.routes';
import collaborationRoutes from './modules/collaboration/collaboration.routes';
import aiRoutes from './modules/ai/ai.routes';
import sprintRoutes from './modules/sprint/sprint.routes';
import searchRoutes from './modules/search/search.routes';
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('!!! UNCAUGHT EXCEPTION DURING STARTUP !!!');
  console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! UNHANDLED REJECTION DURING STARTUP !!!');
  console.error('Promise:', promise, 'Reason:', reason);
});

console.log('--- STARTING UP PROJECT PILOT API ---');
console.log('Environment diagnostics:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  HAS_DATABASE_URL: !!process.env.DATABASE_URL,
  DATABASE_URL_LEN: process.env.DATABASE_URL?.length || 0,
  HAS_REDIS_URL: !!process.env.REDIS_URL,
  REDIS_URL_LEN: process.env.REDIS_URL?.length || 0,
  HAS_OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  HAS_JWT_SECRET: !!process.env.JWT_SECRET,
  HAS_JWT_REFRESH_SECRET: !!process.env.JWT_REFRESH_SECRET,
});

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Redis setup for caching and rate limiting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis types compatible
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(limiter);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/collaboration', collaborationRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/sprints', sprintRoutes);
app.use('/api/v1/search', searchRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handling
app.use(errorHandler);

// Realtime
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-user', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User joined personal room: user:${userId}`);
  });

  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`User joined conversation room: conversation:${conversationId}`);
  });

  socket.on('join-project', (projectId: string) => {
    socket.join(`project:${projectId}`);
    console.log(`User joined project room: project:${projectId}`);
  });

  socket.on('leave-project', (projectId: string) => {
    socket.leave(`project:${projectId}`);
    console.log(`User left project room: project:${projectId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

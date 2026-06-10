import { z } from 'zod';

export const baseIdSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// --- AUTH VALIDATION ---

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8).max(100),
});

export const googleSignInSchema = z.object({
  token: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type GoogleSignInInput = z.infer<typeof googleSignInSchema>;
// --- ORGANIZATION VALIDATION ---

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ORG_ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER', 'CLIENT']),
});

export const acceptInvitationSchema = z.object({
  token: z.string(),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['ORG_ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER', 'CLIENT']),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// --- PROJECT VALIDATION ---

export const createProjectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).default('PLANNING'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  organizationId: z.string().uuid(),
  managerId: z.string().uuid(),
});

export const updateProjectSchema = createProjectSchema.partial().omit({ organizationId: true });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// --- TASK VALIDATION ---

export const createTaskSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedHours: z.number().nonnegative().optional().nullable(),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  sprintId: z.string().uuid().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true });

export const moveTaskSchema = z.object({
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;

// --- CHAT VALIDATION ---

export const createConversationSchema = z.object({
  name: z.string().max(100).optional(),
  type: z.enum(['DIRECT', 'GROUP', 'PROJECT', 'ORGANIZATION']).default('DIRECT'),
  participantIds: z.array(z.string().uuid()).min(1),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  conversationId: z.string().uuid(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// --- AI VALIDATION ---

export const aiGenerateTasksSchema = z.object({
  prompt: z.string().min(10).max(1000),
  projectId: z.string().uuid(),
});

export const aiRiskAnalysisSchema = z.object({
  projectId: z.string().uuid(),
});

export type AiGenerateTasksInput = z.infer<typeof aiGenerateTasksSchema>;
export type AiRiskAnalysisInput = z.infer<typeof aiRiskAnalysisSchema>;

// --- SPRINT VALIDATION ---

export const createSprintSchema = z.object({
  name: z.string().min(2).max(100),
  goal: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  projectId: z.string().uuid(),
});

export const updateSprintSchema = createSprintSchema.partial().omit({ projectId: true });

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;

// --- SEARCH VALIDATION ---

export const globalSearchSchema = z.object({
  query: z.string().min(1),
  organizationId: z.string().uuid().optional(),
});

export type GlobalSearchInput = z.infer<typeof globalSearchSchema>;

// --- TASK DETAILS VALIDATION ---

export const addCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  taskId: z.string().uuid(),
});

export const addDependencySchema = z.object({
  dependencyTaskId: z.string().uuid(),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type AddDependencyInput = z.infer<typeof addDependencySchema>;

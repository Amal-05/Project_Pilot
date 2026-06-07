import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AiService {
  async generateTasks(userId: string, projectId: string, prompt: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a project management assistant. Generate a list of tasks for a project based on the user prompt. Return the tasks in JSON format as an array of objects with title and description fields.',
        },
        {
          role: 'user',
          content: `Project Name: ${project.name}\nProject Description: ${project.description}\nUser Prompt: ${prompt}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = JSON.parse(response.choices[0].message.content || '{"tasks": []}');
    const tasks = content.tasks || [];

    // Log AI usage
    await prisma.aiUsageLog.create({
      data: {
        userId,
        feature: 'TASK_GENERATION',
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    });

    return tasks;
  }

  async analyzeRisk(userId: string, projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: true },
    });
    if (!project) throw new Error('Project not found');

    const tasksSummary = project.tasks.map(t => `- ${t.title} (${t.status})`).join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a project risk analyst. Analyze the following project and its tasks to identify potential risks. Provide a summary of risks and suggested mitigations.',
        },
        {
          role: 'user',
          content: `Project: ${project.name}\nDescription: ${project.description}\nTasks:\n${tasksSummary}`,
        },
      ],
    });

    // Log AI usage
    await prisma.aiUsageLog.create({
      data: {
        userId,
        feature: 'RISK_ANALYSIS',
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    });

    return response.choices[0].message.content;
  }
}

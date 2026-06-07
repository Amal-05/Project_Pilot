import { Request, Response, NextFunction } from 'express';
import { AiService } from './ai.service';
import { aiGenerateTasksSchema, aiRiskAnalysisSchema } from '@project-pilot/validation';

const aiService = new AiService();

export class AiController {
  async generateTasks(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = aiGenerateTasksSchema.parse(req.body);
      const result = await aiService.generateTasks(req.user.userId, validatedData.projectId, validatedData.prompt);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async analyzeRisk(req: any, res: Response, next: NextFunction) {
    try {
      const validatedData = aiRiskAnalysisSchema.parse(req.body);
      const result = await aiService.analyzeRisk(req.user.userId, validatedData.projectId);
      res.status(200).json({ analysis: result });
    } catch (error) {
      next(error);
    }
  }
}

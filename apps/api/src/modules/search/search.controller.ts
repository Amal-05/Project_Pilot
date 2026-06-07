import { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';
import { globalSearchSchema } from '@project-pilot/validation';

const searchService = new SearchService();

export class SearchController {
  async search(req: any, res: Response, next: NextFunction) {
    try {
      const { q, organizationId } = req.query;
      const result = await searchService.globalSearch(req.user.userId, q as string, organizationId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

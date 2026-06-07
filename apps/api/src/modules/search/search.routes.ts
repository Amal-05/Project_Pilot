import { Router } from 'express';
import { SearchController } from './search.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();
const searchController = new SearchController();

router.use(protect);

router.get('/', searchController.search);

export default router;

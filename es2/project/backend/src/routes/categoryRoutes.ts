import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Public routes
router.get('/', async (req, res) => {
  await categoryController.getAllCategoriesController(req, res);
});

router.get('/:id', async (req, res) => {
  await categoryController.getCategoryByIdController(req, res);
});

export default router;
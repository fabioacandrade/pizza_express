import { Router } from 'express';
import * as pizzaOptionController from '../controllers/pizzaOptionController';

const router = Router();

// Todas as rotas são públicas agora
router.get('/', pizzaOptionController.getAllPizzaOptions);
router.get('/type/:type', pizzaOptionController.getPizzaOptionsByType);
router.get('/:id', pizzaOptionController.getPizzaOptionById);
router.post('/', pizzaOptionController.createPizzaOption);
router.put('/:id', pizzaOptionController.updatePizzaOption);
router.delete('/:id', pizzaOptionController.deletePizzaOption);

export default router;
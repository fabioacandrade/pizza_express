import { Router } from 'express';
import * as orderController from '../controllers/orderController';

const router = Router();

// Todas as rotas de pedidos agora são públicas
router.get('/', async (req, res) => {
  await orderController.getUserOrders(req, res);
});
router.get('/:id', async (req, res) => {
  await orderController.getOrderById(req, res);
});
router.post('/', async (req, res) => {
  await orderController.createOrder(req, res);
});
router.put('/:id/status', async (req, res) => {
  await orderController.updateOrderStatus(req, res);
});
router.put('/:id/cancel', async (req, res) => {
  await orderController.cancelOrder(req, res);
});

export default router;
import { Router } from 'express';
import * as paymentMethodController from '../controllers/paymentMethodController';

const router = Router();

// Rotas de métodos de pagamento sem autenticação
router.get('/', async (req, res) => {
  await paymentMethodController.getUserPaymentMethods(req, res);
});
router.get('/:id', async (req, res) => {
  await paymentMethodController.getPaymentMethodById(req, res);
});
router.post('/', async (req, res) => {
  await paymentMethodController.createPaymentMethod(req, res);
});
router.put('/:id', async (req, res) => {
  await paymentMethodController.updatePaymentMethod(req, res);
});
router.delete('/:id', async (req, res) => {
  await paymentMethodController.deletePaymentMethod(req, res);
});
router.put('/:id/set-default', async (req, res) => {
  await paymentMethodController.setDefaultPaymentMethod(req, res);
});

export default router;
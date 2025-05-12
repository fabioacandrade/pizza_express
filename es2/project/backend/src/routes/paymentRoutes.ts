import { Router } from 'express';
import { createPaymentIntent, createCheckoutSession } from '../controllers/paymentController';

const router = Router();

// Rota para criar um PaymentIntent (não requer autenticação)
router.post('/create-payment-intent', createPaymentIntent);

// Rota para criar uma sessão de checkout (requer autenticação)
router.post('/create-checkout-session', createCheckoutSession);

export default router;


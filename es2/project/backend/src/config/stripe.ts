import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Key:', stripeKey ? 'Present' : 'Missing');

if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Inicializa o Stripe com a chave secreta
export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-04-30.basil' // Versão estável atual do Stripe
});

// Chave pública do Stripe para uso no frontend
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';


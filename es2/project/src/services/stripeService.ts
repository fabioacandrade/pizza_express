import { loadStripe } from '@stripe/stripe-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    throw error;
  }
};

export const createCheckoutSession = async (items: any[], successUrl: string, cancelUrl: string) => {
  try {
    const response = await fetch(`${API_URL}/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, successUrl, cancelUrl }),
    });

    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
}; 
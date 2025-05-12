import { Request, Response } from 'express';
import { stripe } from '../config/stripe';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    // Criar um PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status
    });
  } catch (error: any) {
    console.error('Erro ao criar PaymentIntent:', error);
    return res.status(500).json({ 
      error: error.message || 'Erro ao processar pagamento',
      code: error.code
    });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { items, deliveryFee, address } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...items.map((item: any) => ({
          price_data: {
            currency: 'brl',
            product_data: {
              name: item.name,
              description: item.options || item.notes,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Taxa de Entrega',
            },
            unit_amount: Math.round(deliveryFee * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      customer_email: req.user?.email,
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      metadata: {
        addressId: address.id,
        userId: req.user?.id,
      },
    });

    res.json({ id: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao criar sessão de pagamento',
      code: error.code
    });
  }
};


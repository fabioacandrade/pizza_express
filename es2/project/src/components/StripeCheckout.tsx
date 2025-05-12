import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onPaymentReady: (processPayment: () => Promise<void>) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onError, onPaymentReady }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const processPayment = async () => {
    if (!stripe || !elements) {
      onError('Stripe não inicializado corretamente');
      return;
    }

    setErrorMessage(null);

    try {
      // Criar PaymentIntent no backend
      const response = await fetch('http://localhost:3000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        throw new Error('Erro ao criar intenção de pagamento');
      }

      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error('Resposta inválida do servidor');
      }

      // Confirmar o pagamento com o cartão
      const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Erro ao confirmar pagamento');
      }

      // Se chegou aqui, o pagamento foi bem-sucedido
      console.log('Pagamento confirmado com sucesso!');
      onSuccess();
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      const message = error.message || 'Erro ao processar pagamento';
      setErrorMessage(message);
      onError(message);
    }
  };

  // Expor a função de processamento de pagamento para o componente pai
  React.useEffect(() => {
    onPaymentReady(processPayment);
  }, [stripe, elements, amount]);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true, // Não precisamos do CEP pois já temos o endereço
          }}
        />
      </div>
      
      {errorMessage && (
        <div className="text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

interface StripeCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onPaymentReady: (processPayment: () => Promise<void>) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripeCheckout; 
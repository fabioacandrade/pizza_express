import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../services/stripeService';

interface StripeElementsProviderProps {
  children: React.ReactNode;
}

const StripeElementsProvider: React.FC<StripeElementsProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeElementsProvider; 
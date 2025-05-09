import React from 'react';
import { OrderStatus } from '../types';
import { Clock, Truck } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  const steps = [
    { id: OrderStatus.RECEIVED, name: 'Pedido confirmado', icon: Clock },
    { id: OrderStatus.PREPARING, name: 'Em preparo', icon: Clock },
    { id: OrderStatus.OUT_FOR_DELIVERY, name: 'Saiu para entrega', icon: Truck },
    { id: OrderStatus.DELIVERED, name: 'Entregue', icon: Clock }
  ];

  // Find the index of the current status
  const currentStepIndex = steps.findIndex(step => step.id === status);

  if (status === OrderStatus.CANCELED) {
    return (
      <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="flex items-center text-red-600">
          <Clock className="mr-2" size={24} />
          <h3 className="text-lg font-medium">Pedido cancelado</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          // Determine if step is active, completed, or upcoming
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <li key={step.id} className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0
                  ${isActive ? 'bg-red-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-100 text-gray-500'}`}
                >
                  {React.createElement(step.icon, { size: 24 })}
                </div>
                <div className="text-center">
                  <h3 className={`text-sm font-medium mt-2
                    ${isActive ? 'text-red-600' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-500'}`}
                  >
                    {step.name}
                  </h3>
                </div>
              </div>
              
              {index !== steps.length - 1 && (
                <div className={`w-full bg-gray-200 h-0.5 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OrderStatusTracker;
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import OrderStatusTracker from '../components/OrderStatusTracker';
import { OrderStatus, Order } from '../types';
import { ArrowLeft, ClipboardCheck, MapPin, CreditCard, Clock } from 'lucide-react';

const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useAppContext();
  
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch order data when component mounts or id changes
  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const orderData = await getOrderById(id);
          if (!orderData) {
            navigate('/menu');
          } else {
            setOrder(orderData);
            setEstimatedTime(orderData.estimatedDeliveryTime);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          navigate('/menu');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchOrder();
    
    // Cleanup function to clear any pending timers when component unmounts
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [id, getOrderById, navigate]);

  // Update local order state when status changes, but only periodically
  useEffect(() => {
    let isMounted = true;
    
    const refreshOrder = async () => {
      if (!id || !isMounted) return;
      
      try {
        const updatedOrder = await getOrderById(id);
        if (updatedOrder && isMounted) {
          // Só atualizar o estado se houver mudanças reais
          if (updatedOrder.status !== order?.status) {
            setOrder(updatedOrder);
            setEstimatedTime(updatedOrder.estimatedDeliveryTime);
          }
        }
      } catch (error) {
        console.error('Error refreshing order:', error);
      }
      
      // Agendar próxima atualização apenas se não for DELIVERED ou CANCELED
      if (isMounted && order && 
          order.status !== OrderStatus.DELIVERED && 
          order.status !== OrderStatus.CANCELED) {
        refreshTimerRef.current = setTimeout(refreshOrder, 10000);
      }
    };

    // Iniciar atualizações periódicas apenas se o pedido existir e não estiver finalizado
    if (order && 
        order.status !== OrderStatus.DELIVERED && 
        order.status !== OrderStatus.CANCELED) {
      refreshTimerRef.current = setTimeout(refreshOrder, 10000);
    }
    
    return () => {
      isMounted = false;
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [id, getOrderById, order?.status]);
  
  // Countdown timer para o tempo estimado de entrega
  useEffect(() => {
    if (!estimatedTime || estimatedTime <= 0 || 
        !order || order.status === OrderStatus.DELIVERED) {
      return;
    }
    
    const interval = setInterval(() => {
      setEstimatedTime(prev => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [estimatedTime, order]);
  
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <p className="text-gray-600">Carregando...</p>
    </div>
  );
  
  if (!order) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Meus Pedidos
          </button>
          
          <div className="text-sm text-gray-500">
            Pedido #{order.id.substring(0, 8)}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <ClipboardCheck size={24} className="text-red-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Status do Pedido</h1>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">
              Pedido realizado em {formatDate(order.createdAt)}
            </p>
          </div>
          
          <OrderStatusTracker status={order.status} />
          
          {order.status === OrderStatus.OUT_FOR_DELIVERY && estimatedTime && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center text-blue-800">
                <Clock className="mr-2" size={20} />
                <h3 className="font-medium">Tempo estimado de entrega</h3>
              </div>
              <p className="mt-1 text-blue-700">
                Aproximadamente {estimatedTime} minutos
              </p>
            </div>
          )}
          
          {order.status === OrderStatus.DELIVERED && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-800">
                <Clock className="mr-2" size={20} />
                <h3 className="font-medium">Pedido entregue!</h3>
              </div>
              <p className="mt-1 text-green-700">
                Aproveite a sua refeição!
              </p>
            </div>
          )}
        </div>
        
        {/* Map for delivery tracking - only show when out for delivery */}
        {order.status === OrderStatus.OUT_FOR_DELIVERY && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <MapPin size={24} className="text-red-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">Acompanhar Entrega</h2>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {/* This would be replaced with a real map implementation */}
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-gray-500">Mapa de localização em tempo real</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Seu pedido está a caminho!</p>
              <p>O entregador está seguindo para o seu endereço de entrega.</p>
            </div>
          </div>
        )}
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Detalhes do Pedido</h2>
          
          <div className="space-y-6">
            {/* Address */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center text-gray-700 mb-2">
                <MapPin size={18} className="mr-2" />
                <h3 className="font-medium">Endereço de Entrega</h3>
              </div>
              <p className="text-gray-600">{order.address.street}, {order.address.number}</p>
              {order.address.complement && (
                <p className="text-gray-600">{order.address.complement}</p>
              )}
              <p className="text-gray-600">
                {order.address.neighborhood}, {order.address.city} - {order.address.state}
              </p>
              <p className="text-gray-600">CEP: {order.address.zipCode}</p>
            </div>
            
            {/* Payment */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center text-gray-700 mb-2">
                <CreditCard size={18} className="mr-2" />
                <h3 className="font-medium">Forma de Pagamento</h3>
              </div>
              <p className="text-gray-600">
                {order.paymentMethod.type === 'CREDIT_CARD' && 'Cartão de Crédito'}
                {order.paymentMethod.type === 'DEBIT_CARD' && 'Cartão de Débito'}
                {order.paymentMethod.type === 'PIX' && 'PIX'}
                {order.paymentMethod.type === 'CASH' && 'Dinheiro'}
                {' - '}
                {order.paymentMethod.details}
              </p>
            </div>
            
            {/* Items */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Itens</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="text-gray-800">
                        {item.quantity}x {item.product.name}
                      </p>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {item.selectedOptions.map((option, index) => (
                            <span key={option.id}>
                              {option.name}
                              {index < item.selectedOptions!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-800">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Totals */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-800">{formatCurrency(order.total - order.deliveryFee)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Taxa de entrega</p>
                <p className="text-gray-800">{formatCurrency(order.deliveryFee)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p className="text-gray-800">Total</p>
                <p className="text-red-600">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
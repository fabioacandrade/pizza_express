import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { Address, PaymentMethod } from '../types';
import { ArrowLeft, ChevronRight, CreditCard, MapPin } from 'lucide-react';
import { addressApi, paymentMethodApi } from '../services/api';

const CheckoutPage: React.FC = () => {
  const { 
    cart,
    cartTotal,
    createOrder
  } = useAppContext();
  
  const navigate = useNavigate();
  
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [deliveryFee] = useState(5.00);
  
  // Form state
  const [address, setAddress] = useState<Address>({
    id: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    id: '',
    type: 'PIX',
    details: 'Pagamento via PIX'
  });
  
  // Redirect to menu if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/menu');
    }
  }, [cart, navigate]);
  
  const handlePlaceOrder = async () => {
    if (!address.street || !address.number || !address.neighborhood || !address.city || !address.state || !address.zipCode) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço');
      return;
    }
    
    setIsCreatingOrder(true);
    setOrderError(null);
    
    try {
      // Primeiro vamos criar ou recuperar o endereço
      let orderAddress = address;
      
      // Criar um novo endereço se não tiver um ID
      if (!address.id) {
        try {
          // Crie o novo endereço
          const addressResponse = await addressApi.create({
            street: address.street,
            number: address.number || '',
            complement: address.complement || '',
            neighborhood: address.neighborhood || '',
            city: address.city,
            state: address.state,
            zipCode: address.zipCode
          });
          
          // Use o endereço recém-criado para o pedido
          orderAddress = addressResponse.data;
        } catch (error) {
          console.error('Error creating address:', error);
          setOrderError('Erro ao criar endereço. Por favor, tente novamente.');
          setIsCreatingOrder(false);
          return;
        }
      }
      
      // Agora vamos criar o método de pagamento também
      let orderPaymentMethod = paymentMethod;
      
      // Criar um novo método de pagamento se não tiver um ID
      if (!paymentMethod.id) {
        try {
          // Crie o novo método de pagamento
          const paymentResponse = await paymentMethodApi.create({
            type: paymentMethod.type,
            details: paymentMethod.details || `Pagamento via ${paymentMethod.type === 'PIX' ? 'PIX' : 'Dinheiro'}`
          });
          
          // Use o método de pagamento recém-criado para o pedido
          orderPaymentMethod = paymentResponse.data;
        } catch (error) {
          console.error('Error creating payment method:', error);
          setOrderError('Erro ao criar método de pagamento. Por favor, tente novamente.');
          setIsCreatingOrder(false);
          return;
        }
      }
      
      // Agora criar o pedido com o endereço e método de pagamento criados/recuperados
      const order = await createOrder(orderAddress, orderPaymentMethod);
      if (order) {
        navigate(`/orders/status/${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Erro ao criar o pedido. Por favor, tente novamente.');
    } finally {
      setIsCreatingOrder(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-6 hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>
        
        {orderError && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{orderError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column: Order details */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="mr-2" size={20} />
                <h2 className="text-lg font-medium text-gray-900">Endereço de Entrega</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rua *</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número *</label>
                    <input
                      type="text"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Complemento</label>
                  <input
                    type="text"
                    value={address.complement}
                    onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bairro *</label>
                  <input
                    type="text"
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">CEP *</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="mr-2" size={20} />
                <h2 className="text-lg font-medium text-gray-900">Forma de Pagamento</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-red-600"
                      name="paymentType"
                      value="PIX"
                      checked={paymentMethod.type === 'PIX'}
                      onChange={() => setPaymentMethod({ ...paymentMethod, type: 'PIX' as const, details: 'Pagamento via PIX' })}
                    />
                    <span className="ml-2">PIX</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-red-600"
                      name="paymentType"
                      value="CASH"
                      checked={paymentMethod.type === 'CASH'}
                      onChange={() => setPaymentMethod({ ...paymentMethod, type: 'CASH' as const, details: 'Pagamento em Dinheiro' })}
                    />
                    <span className="ml-2">Dinheiro</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h2>
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product.name} x {item.quantity}
                      </h3>
                      
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {item.selectedOptions.map((option, index) => (
                            <span key={option.id}>
                              {option.name}
                              {index < item.selectedOptions!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="mt-1 text-xs text-gray-500 italic">"{item.notes}"</p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column: Order summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">{formatCurrency(cartTotal)}</p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Taxa de entrega</p>
                  <p className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(cartTotal + deliveryFee)}</p>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={isCreatingOrder}
                className={`mt-6 w-full py-3 px-4 rounded-md font-medium text-white flex items-center justify-center
                  ${isCreatingOrder
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 transition-colors'
                  }`}
              >
                {isCreatingOrder ? (
                  <span>Processando...</span>
                ) : (
                  <>
                    Finalizar Pedido
                    <ChevronRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
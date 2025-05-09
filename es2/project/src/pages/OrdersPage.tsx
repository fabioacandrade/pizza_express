import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ClipboardList, ChevronRight } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const { orders } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <ClipboardList size={24} className="text-red-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h2>
            <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido.</p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/status/${order.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Pedido #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {order.status === 'RECEIVED' && 'Pedido Recebido'}
                      {order.status === 'PREPARING' && 'Em Preparo'}
                      {order.status === 'OUT_FOR_DELIVERY' && 'Saiu para Entrega'}
                      {order.status === 'DELIVERED' && 'Entregue'}
                      {order.status === 'CANCELED' && 'Cancelado'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {item.quantity}x {item.product.name}
                            </p>
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                              <p className="text-xs text-gray-500">
                                {item.selectedOptions.map(opt => opt.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total do pedido</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
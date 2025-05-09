import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { 
    cart, 
    cartTotal, 
    removeFromCart, 
    updateCartItemQuantity, 
    isCartOpen, 
    toggleCart 
  } = useAppContext();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };
  
  // Handle ESC key to close the cart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the close button when cart opens
    if (isCartOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, toggleCart]);

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden" 
      aria-labelledby="cart-heading"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggleCart}
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md" ref={cartRef}>
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Cart header */}
            <div className="px-4 py-6 bg-red-600 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 id="cart-heading" className="text-lg font-medium text-white flex items-center">
                  <ShoppingCart className="mr-2" aria-hidden="true" />
                  Seu carrinho
                </h2>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={toggleCart}
                  aria-label="Fechar carrinho"
                  ref={closeButtonRef}
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="mx-auto text-gray-400" aria-hidden="true" />
                  <p className="mt-4 text-gray-500">Seu carrinho está vazio</p>
                  <p className="mt-2 text-sm text-gray-400">Adicione itens do nosso cardápio</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="ml-4 text-sm font-medium text-gray-900">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatCurrency(item.unitPrice)} cada
                          </p>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="mt-1">
                              {item.selectedOptions.map((option, index) => (
                                <span key={option.id} className="text-xs text-gray-500">
                                  {option.name}
                                  {index < item.selectedOptions!.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={14} aria-hidden="true" />
                            </button>
                            <span className="mx-2 text-gray-700 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={14} aria-hidden="true" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-500"
                            aria-label="Remover item"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatCurrency(cartTotal)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Frete calculado no checkout
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700"
                  >
                    Finalizar pedido
                  </button>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={toggleCart}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
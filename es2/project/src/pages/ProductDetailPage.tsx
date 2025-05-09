import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { PizzaOption, Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, addToCart } = useAppContext();
  
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<PizzaOption[]>([]);
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch product data when component mounts or id changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const productData = await getProductById(id);
          if (!productData) {
            navigate('/menu');
          } else {
            setProduct(productData);
            setTotalPrice(productData.basePrice);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          navigate('/menu');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id, getProductById, navigate]);
  
  // Update total price when options or quantity changes
  useEffect(() => {
    if (product) {
      const optionsPrice = selectedOptions.reduce((sum, option) => sum + option.additionalPrice, 0);
      setTotalPrice((product.basePrice + optionsPrice) * quantity);
    }
  }, [product, selectedOptions, quantity]);
  
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <p className="text-gray-600">Carregando...</p>
    </div>
  );
  
  if (!product) return null;
  
  // Group options by type for display
  const optionsByType = product.availableOptions?.reduce((acc: Record<string, PizzaOption[]>, option: PizzaOption) => {
    if (!acc[option.type]) {
      acc[option.type] = [];
    }
    acc[option.type].push(option);
    return acc;
  }, {} as Record<string, PizzaOption[]>) ?? {};
  
  const handleOptionChange = (option: PizzaOption, type: string) => {
    // For SIZE, DOUGH, and CRUST, only one option can be selected per type
    if (['SIZE', 'DOUGH', 'CRUST'].includes(type)) {
      setSelectedOptions(prev => [
        ...prev.filter(opt => opt.type !== type),
        option
      ]);
    } else {
      // For EXTRA, multiple options can be selected
      const isAlreadySelected = selectedOptions.some(opt => opt.id === option.id);
      if (isAlreadySelected) {
        setSelectedOptions(prev => prev.filter(opt => opt.id !== option.id));
      } else {
        setSelectedOptions(prev => [...prev, option]);
      }
    }
  };
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions, notes);
    navigate('/menu');
  };
  
  const isOptionSelected = (option: PizzaOption) => {
    return selectedOptions.some(opt => opt.id === option.id);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-6 hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-64 md:h-full">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="text-2xl font-bold text-red-600 mb-6">
                {formatCurrency(totalPrice)}
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Quantidade</h3>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="p-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={increaseQuantity}
                    className="p-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Options Selectors (for Pizza) */}
              {product.type === 'PIZZA' && product.availableOptions && (
                <div className="space-y-6">
                  {/* Size Options */}
                  {optionsByType['SIZE'] && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Escolha o tamanho</h3>
                      <div className="flex flex-wrap gap-2">
                        {optionsByType['SIZE'].map((option: PizzaOption) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionChange(option, 'SIZE')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              isOptionSelected(option) 
                                ? 'bg-red-600 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-red-300'
                            }`}
                          >
                            {option.name}
                            {option.additionalPrice > 0 && ` (+${formatCurrency(option.additionalPrice)})`}
                            {option.additionalPrice < 0 && ` (${formatCurrency(option.additionalPrice)})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Dough Options */}
                  {optionsByType['DOUGH'] && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Escolha a massa</h3>
                      <div className="flex flex-wrap gap-2">
                        {optionsByType['DOUGH'].map((option: PizzaOption) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionChange(option, 'DOUGH')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              isOptionSelected(option) 
                                ? 'bg-red-600 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-red-300'
                            }`}
                          >
                            {option.name}
                            {option.additionalPrice > 0 && ` (+${formatCurrency(option.additionalPrice)})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Crust Options */}
                  {optionsByType['CRUST'] && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Escolha a borda</h3>
                      <div className="flex flex-wrap gap-2">
                        {optionsByType['CRUST'].map((option: PizzaOption) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionChange(option, 'CRUST')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              isOptionSelected(option) 
                                ? 'bg-red-600 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-red-300'
                            }`}
                          >
                            {option.name}
                            {option.additionalPrice > 0 && ` (+${formatCurrency(option.additionalPrice)})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Extra Options */}
                  {optionsByType['EXTRA'] && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Adicionais (Opcional)</h3>
                      <div className="flex flex-wrap gap-2">
                        {optionsByType['EXTRA'].map((option: PizzaOption) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionChange(option, 'EXTRA')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              isOptionSelected(option) 
                                ? 'bg-red-600 text-white' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:border-red-300'
                            }`}
                          >
                            {option.name}
                            {option.additionalPrice > 0 && ` (+${formatCurrency(option.additionalPrice)})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Additional Notes */}
              <div className="mt-6">
                <label htmlFor="notes" className="block text-lg font-medium text-gray-900 mb-3">
                  Observações (Opcional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Sem cebola, bem passado, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              {/* Add to Cart Button */}
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
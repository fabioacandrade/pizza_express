import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">{product.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(product.basePrice)}</p>
            {product.type === 'PIZZA' && (
              <p className="text-xs text-gray-500">Personalização disponível</p>
            )}
          </div>
          <button 
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
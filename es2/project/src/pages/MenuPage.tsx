import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import { Search } from 'lucide-react';

const MenuPage: React.FC = () => {
  const { products, getProductsByCategory, activeCategory } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get products by selected category
  const categoryProducts = getProductsByCategory(activeCategory);
  
  // Filter products by search term
  const filteredProducts = searchTerm.trim() === ''
    ? categoryProducts
    : products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Cardápio</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="mb-8">
            <CategoryList />
          </div>
          
          {/* Products */}
          {searchTerm.trim() !== '' ? (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Resultados da busca: "{searchTerm}"
              </h2>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado para "{searchTerm}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {categoryProducts.length} produtos encontrados
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import PromotionBanner from '../components/PromotionBanner';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import { promotions } from '../mockData';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { products, getProductsByCategory, activeCategory } = useAppContext();
  
  // Get featured products
  const featuredProducts = products.filter(product => product.available).slice(0, 4); 
   
  // Get products by selected category
  const categoryProducts = getProductsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="w-full bg-red-600 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                As Melhores Pizzas da Cidade
              </h1>
              <p className="text-white/90 text-lg mb-6 max-w-xl">
                Ingredientes frescos, receitas tradicionais e entrega rápida diretamente na sua casa.
              </p>
              <div className="flex space-x-4">
                <Link to="/menu" className="bg-white text-red-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Ver Cardápio
                </Link>
                <Link to="/promotions" className="bg-transparent border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                  Promoções
                </Link>
              </div>
            </div>
            <div className="hidden md:block w-full max-w-md">
              <img 
                src="https://images.pexels.com/photos/3944311/pexels-photo-3944311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Pizza" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Promotions Carousel */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Promoções</h2>
          <div className="relative overflow-hidden">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="w-full min-w-[300px] sm:min-w-[400px]">
                  <PromotionBanner promotion={promotion} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mais Pedidos</h2>
            <Link to="/menu" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              Ver todos
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Categories and Products */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Nosso Cardápio</h2>
          
          <CategoryList />
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Pronto para experimentar?</span>
              <span className="block mt-1">Faça seu pedido agora mesmo.</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-xl text-gray-300">
              Entrega rápida, sabor incomparável.
            </p>
            <div className="mt-8">
              <Link to="/menu" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10 transition-colors">
                Pedir Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
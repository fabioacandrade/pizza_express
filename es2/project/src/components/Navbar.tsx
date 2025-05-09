import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ShoppingCart, Menu, X, ClipboardList, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { cartCount, toggleCart, isAuthenticated, user } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Simples verificação para identificar administradores
  // Em uma aplicação real, você teria um papel/role específico para isso
  const isAdmin = isAuthenticated && user?.email?.includes('admin');

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-red-600 font-bold text-xl">PIZZA</span>
              <span className="text-gray-700 font-bold text-xl">EXPRESS</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium">
              Início
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium">
              Cardápio
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium flex items-center">
              <ClipboardList size={18} className="mr-1" />
              Meus Pedidos
            </Link>
            {isAdmin && (
              <Link to="/admin/create-pizza" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium flex items-center">
                <PlusCircle size={18} className="mr-1" />
                Nova Pizza
              </Link>
            )}
            <button 
              onClick={toggleCart}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 hover:bg-red-700"
            >
              <ShoppingCart size={18} className="mr-2" />
              <span className="font-medium">{cartCount > 0 ? `${cartCount}` : 'Carrinho'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button 
              onClick={toggleCart}
              className="bg-red-600 text-white p-2 rounded-md flex items-center"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-2 right-14 bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 p-2 rounded-md"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Início
          </Link>
          <Link 
            to="/menu" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cardápio
          </Link>
          <Link 
            to="/orders" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Meus Pedidos
          </Link>
          {isAdmin && (
            <Link 
              to="/admin/create-pizza" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nova Pizza
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
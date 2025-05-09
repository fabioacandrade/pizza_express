import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import OrdersPage from './pages/OrdersPage';
import CreatePizzaPage from './pages/CreatePizzaPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <Cart />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/status/:id" element={<OrderStatusPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin/create-pizza" element={<CreatePizzaPage />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">PIZZA EXPRESS</h3>
                  <p className="text-gray-300">
                    As melhores pizzas da cidade, com ingredientes frescos e muita qualidade.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Horários</h3>
                  <p className="text-gray-300">
                    Segunda a Sábado: 18h às 23h <br />
                    Domingo: 18h às 22h
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Contato</h3>
                  <p className="text-gray-300">
                    contato@pizzaexpress.com <br />
                    (11) 99999-9999
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                <p>&copy; 2025 Pizza Express. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
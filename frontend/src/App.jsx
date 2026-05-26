import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Toast from './components/Toast';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Foods from './pages/Foods';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderStatusModal from './components/OrderStatusModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Home as HomeIcon, Compass, ShoppingBag, Shield } from 'lucide-react';

const MainAppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Automatically check if admin token expired or invalid (simple check)
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
    }
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'categories':
        return (
          <Categories
            setActiveTab={setActiveTab}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'foods':
        return (
          <Foods
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setActiveTab={setActiveTab}
          />
        );
      case 'cart':
        return <Cart setActiveTab={setActiveTab} />;
      case 'checkout':
        return <Checkout setActiveTab={setActiveTab} />;
      case 'track':
        return (
          <div className="flex flex-col gap-5 pt-2">
            <h2 className="font-serif font-bold text-xl text-restaurant-text-primary px-1">
              Buyurtmangiz <span className="gold-gradient-text">Holati</span>
            </h2>
            <OrderStatusModal onClose={() => setActiveTab('home')} />
          </div>
        );
      case 'admin-login':
        return (
          <AdminLogin
            setAdminToken={setAdminToken}
            setActiveTab={setActiveTab}
          />
        );
      case 'admin-dashboard':
        if (!adminToken) {
          setActiveTab('admin-login');
          return null;
        }
        return (
          <AdminDashboard
            adminToken={adminToken}
            setAdminToken={setAdminToken}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  const showNavbar = !['admin-dashboard', 'admin-login'].includes(activeTab);

  return (
    <div className="flex flex-col h-full bg-restaurant-bg relative max-w-md mx-auto shadow-2xl border-l border-r border-restaurant-border/40">
      {/* Toast Alert floating notifications */}
      <Toast />

      {/* Top sticky logo bar */}
      {showNavbar && (
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Primary content area */}
      <main className="flex-grow overflow-y-auto px-4 py-4 mb-20 scrollbar-hide">
        {renderActivePage()}
      </main>

      {/* Mobile Footer Navigation Bar */}
      {showNavbar && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0B0B0C]/90 backdrop-blur-md border-t border-restaurant-border px-6 py-3.5 z-40 flex items-center justify-between shadow-2xl">
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-restaurant-gold' : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Bosh</span>
          </button>

          {/* Tab 2: Menu / Categories */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveTab('categories');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              ['categories', 'foods'].includes(activeTab) ? 'text-restaurant-gold' : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Menyu</span>
          </button>

          {/* Tab 3: Cart */}
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center gap-1 relative transition-all ${
              activeTab === 'cart' ? 'text-restaurant-gold' : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-restaurant-gold text-[#0B0B0C] text-[8px] font-bold flex items-center justify-center border border-restaurant-bg">
                {cartCount}
              </span>
            )}
            <span className="text-[9px] font-semibold uppercase tracking-wider">Savat</span>
          </button>

          {/* Tab 4: Admin */}
          <button
            onClick={() => setActiveTab(adminToken ? 'admin-dashboard' : 'admin-login')}
            className={`flex flex-col items-center gap-1 transition-all ${
              ['admin-dashboard', 'admin-login'].includes(activeTab) ? 'text-restaurant-gold' : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Admin</span>
          </button>
        </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
};

export default App;

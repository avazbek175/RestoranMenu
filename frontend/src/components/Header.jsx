import React from 'react';
import { Compass, ShoppingBag, History, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = ({ activeTab, setActiveTab }) => {
  const { cartItems, activeOrder } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0B0C]/85 backdrop-blur-md border-b border-restaurant-border px-4 py-3 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setActiveTab('home')}
      >
        <div className="w-8 h-8 rounded-full border border-restaurant-gold flex items-center justify-center gold-border-glow bg-gradient-to-br from-restaurant-card to-[#121214]">
          <Award className="w-4 h-4 text-restaurant-gold" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-base tracking-wider text-restaurant-text-primary">
            L'Empire <span className="gold-gradient-text">de l'Or</span>
          </h1>
          <p className="text-[9px] uppercase tracking-widest text-restaurant-gold/60 font-semibold">Haute Cuisine</p>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        {activeOrder && (
          <button
            onClick={() => setActiveTab('track')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-restaurant-gold/40 bg-restaurant-gold/10 text-restaurant-gold text-xs font-semibold animate-pulse-subtle"
          >
            <History className="w-3.5 h-3.5" />
            <span>Kuzatish</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('cart')}
          className={`relative p-2 rounded-xl border transition-all ${
            activeTab === 'cart'
              ? 'border-restaurant-gold bg-restaurant-gold/10 text-restaurant-gold'
              : 'border-restaurant-border bg-restaurant-card text-restaurant-text-secondary hover:text-restaurant-text-primary'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-restaurant-gold text-[#0B0B0C] text-[10px] font-bold flex items-center justify-center border-2 border-restaurant-bg animate-pulse-subtle">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;

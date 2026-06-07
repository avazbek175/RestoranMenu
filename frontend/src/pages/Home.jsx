import React from 'react';
import { Compass, PhoneCall } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Home = ({ setActiveTab }) => {
  const { tableNumber } = useCart();

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      {/* Instagram-style Profile Header */}
      <div className="relative rounded-3xl overflow-hidden border border-restaurant-gold/20 gold-border-glow bg-gradient-to-b from-[#121214] to-[#0B0B0C] p-5 text-center flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-restaurant-gold/5 blur-[50px] rounded-full pointer-events-none" />

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full border-2 border-restaurant-gold flex items-center justify-center gold-border-glow bg-gradient-to-br from-restaurant-card to-[#121214] mb-3">
          <span className="text-3xl">🌭</span>
        </div>

        <h1 className="font-serif font-bold text-xl text-restaurant-text-primary">POLVON FOOD</h1>
        <span className="text-[10px] tracking-[0.2em] uppercase text-restaurant-gold/70 font-semibold mt-0.5">Pitnak</span>

        

        <p className="text-xs text-restaurant-text-secondary mt-3 leading-relaxed max-w-[300px]">
          <span className="font-semibold text-restaurant-text-primary">Restaurant</span>
          <br />
          Polvon goja 🍶 | Polvon hot dog 🌭
          <br />
          Polvon yarim tayor maxsulotlari 🥟
        </p>

        <div className="flex items-center gap-1.5 mt-2 text-restaurant-gold text-xs">
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="font-semibold">+998 97-456-62-62</span>
        </div>

        {tableNumber && (
          <div className="mt-3 px-4 py-1.5 rounded-full border border-restaurant-gold/30 bg-restaurant-gold/10 text-restaurant-gold text-xs font-semibold animate-pulse-subtle">
            🪑 Stol №{tableNumber} buyurtma berishga tayyor
          </div>
        )}
      </div>

      {/* Main Call to Action */}
      <button
        onClick={() => setActiveTab('categories')}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold tracking-wide text-sm transition-all duration-300 gold-button-glow hover:scale-[1.01] active:scale-95"
      >
        <Compass className="w-5 h-5" />
        <span>Menyuni Ko'rish</span>
      </button>

      {/* Contact Card */}
      <div className="rounded-2xl border border-restaurant-border bg-restaurant-card/50 backdrop-blur-sm p-4 text-center">
        <PhoneCall className="w-5 h-5 text-restaurant-gold mx-auto mb-2" />
        <h4 className="font-serif font-semibold text-xs text-restaurant-text-primary">Aloqa</h4>
        <p className="text-xs text-restaurant-text-secondary mt-1 leading-relaxed">
          +998 97-456-62-62
        </p>
      </div>
    </div>
  );
};

export default Home;

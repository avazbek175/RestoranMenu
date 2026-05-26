import React from 'react';
import { Compass, ShoppingBag, MapPin, PhoneCall } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Home = ({ setActiveTab }) => {
  const { tableNumber } = useCart();

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* Luxury Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-restaurant-gold/20 gold-border-glow bg-gradient-to-b from-[#121214] to-[#0B0B0C] p-6 text-center flex flex-col items-center justify-center min-h-[220px]">
        {/* Soft Golden Ambient Light Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-restaurant-gold/5 blur-[50px] rounded-full pointer-events-none" />

        <span className="text-[10px] tracking-[0.25em] uppercase text-restaurant-gold font-bold">Texas Burger</span>
        <h2 className="font-serif font-bold text-2xl mt-2 tracking-wide text-restaurant-text-primary leading-tight">
          Haqiqiy <span className="gold-gradient-text">lazzat </span> Imperiyasi
        </h2>
        <p className="text-xs text-restaurant-text-secondary mt-3 max-w-[280px] leading-relaxed">
          Premium darajadagi taomlari, shinam muhit hamda beqiyos xizmat ko'rsatish.
        </p>

        {tableNumber && (
          <div className="mt-5 px-4 py-1.5 rounded-full border border-restaurant-gold/30 bg-restaurant-gold/10 text-restaurant-gold text-xs font-semibold animate-pulse-subtle">
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

      {/* Quick Restaurant Features */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="p-4 rounded-2xl border border-restaurant-border bg-restaurant-card/50 backdrop-blur-sm">
          <MapPin className="w-5 h-5 text-restaurant-gold mb-2" />
          <h4 className="font-serif font-semibold text-xs text-restaurant-text-primary">Manzilimiz</h4>
          <p className="text-[10px] text-restaurant-text-secondary mt-1 leading-relaxed">
            улица Пахлавон Махмуд 42, Urgench, Xorazm Region, Uzbekistan
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-restaurant-border bg-restaurant-card/50 backdrop-blur-sm">
          <PhoneCall className="w-5 h-5 text-restaurant-gold mb-2" />
          <h4 className="font-serif font-semibold text-xs text-restaurant-text-primary">Aloqa</h4>
          <p className="text-[10px] text-restaurant-text-secondary mt-1 leading-relaxed">
            +998 (88) 187 86 88<br />Har kuni 11:00 - 23:00
          </p>
        </div>
      </div>

      {/* Premium Culinary Note */}
      <div className="rounded-2xl border border-restaurant-border bg-[#121214]/30 p-4 text-center">
        <p className="font-serif italic text-xs text-restaurant-text-secondary leading-relaxed">
          "Biz har bir taomni shunchaki tayyorlamaymiz, biz uni san'at asariga aylantiramiz."
        </p>
        <span className="text-[9px] uppercase tracking-wider text-restaurant-gold/75 font-semibold mt-2.5 block">
          — Bosh Shef-Pazandadan
        </span>
      </div>
    </div>
  );
};

export default Home;

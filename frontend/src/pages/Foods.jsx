import React, { useEffect, useState } from 'react';
import FoodCard from '../components/FoodCard';
import { ArrowLeft, Search } from 'lucide-react';



const Foods = ({ selectedCategory, setSelectedCategory, setActiveTab }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Barchasi', 'Burgerlar', 'Fast food', 'Ichimliklar', 'Desertlar'];

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/foods`
        );
        if (response.ok) {
          const data = await response.json();
          setFoods(data);
        }
      } catch (error) {
        console.error('API ulana olmadi:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Filtering Logic
  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'Barchasi' ||
      food.category === selectedCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-8">
      {/* Search & Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('categories')}
          className="p-2 rounded-xl border border-restaurant-border bg-restaurant-card text-restaurant-text-secondary hover:text-restaurant-text-primary transition-all active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Taom qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-2 pl-9 pr-4 text-xs text-restaurant-text-primary focus:outline-none transition-all gold-border-glow placeholder-restaurant-text-secondary/55"
          />
          <Search className="w-4 h-4 text-restaurant-text-secondary/60 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Horizontal categories selectors */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide -mx-4 px-4 sticky top-14 bg-[#0B0B0C] z-20 border-b border-restaurant-border/20 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'Barchasi' ? null : cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              (!selectedCategory && cat === 'Barchasi') || selectedCategory === cat
                ? 'border-restaurant-gold bg-restaurant-gold/10 text-restaurant-gold'
                : 'border-restaurant-border bg-restaurant-card text-restaurant-text-secondary hover:text-restaurant-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 mt-2">
          {[1, 2, 4, 5].map((idx) => (
            <div key={idx} className="rounded-2xl border border-restaurant-border bg-restaurant-card p-3 flex flex-col gap-3.5 animate-pulse">
              <div className="w-full aspect-[4/3] rounded-xl bg-[#1d1d23]" />
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-[#1d1d23] rounded w-3/4" />
                <div className="h-3 bg-[#1d1d23] rounded w-5/6" />
                <div className="h-3 bg-[#1d1d23] rounded w-2/3" />
              </div>
              <div className="flex items-center justify-between border-t border-restaurant-border/30 pt-3">
                <div className="h-5 bg-[#1d1d23] rounded w-2/5" />
                <div className="w-7 h-7 bg-[#1d1d23] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFoods.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-2">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-restaurant-border bg-restaurant-card/30">
          <p className="text-sm text-restaurant-text-secondary">Ushbu so'rov bo'yicha hech qanday taom topilmadi.</p>
        </div>
      )}
    </div>
  );
};

export default Foods;

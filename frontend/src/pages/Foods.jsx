import React, { useEffect, useState } from 'react';
import FoodCard from '../components/FoodCard';
import { ArrowLeft, Search } from 'lucide-react';

// Premium high-quality local dishes as fallbacks if MongoDB database is empty
const LOCAL_FALLBACK_FOODS = [
  {
    _id: '1',
    name: 'Shohona Choyxona Palovi',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600&auto=format&fit=crop',
    category: 'Milliy taomlar',
    description: 'Tilla rang devzira guruch, barra qo\'y go\'shti, dumba yog\'i, mayin to\'g\'ralgan sabzi va sarimsoqpiyoz bilan pishirilgan haqiqiy o\'zbek palovi.'
  },
  {
    _id: '2',
    name: 'Tandir Somsa (3 ta)',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop',
    category: 'Milliy taomlar',
    description: 'Qarsildoq xamir, maydalangan mol go\'shti va dumba yog\'i bilan pechda yoki tandirda pishirilgan an\'anaviy o\'zbek somsasi.'
  },
  {
    _id: '3',
    name: 'Empire Gold Burger',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
    category: 'Fast food',
    description: 'Premium mol go\'shtidan kotlet, eritilgan cheddar pishlog\'i, yangi sabzavotlar va oltin rang maxsus sous bilan yumshoq bulochkada.'
  },
  {
    _id: '4',
    name: 'Qarsildoq Tovuqli Lavash',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop',
    category: 'Fast food',
    description: 'Yupqa lavash xamiri ichida qarsildoq tovuq bo\'laklari, bodring, pomidor, chipslar va oq sarimsoqpiyoz sousi.'
  },
  {
    _id: '5',
    name: 'Mojito Classic (0.4L)',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop',
    category: 'Ichimliklar',
    description: 'Yalpiz barglari, yangi laym bo\'laklari, shakar siropi va muz bilan tayyorlangan tetiklashtiruvchi alkogolsiz kokteyl.'
  },
  {
    _id: '6',
    name: 'Gilos Sharbati Fresh (0.3L)',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop',
    category: 'Ichimliklar',
    description: '100% tabiiy, yangi siqilgan pishgan giloslardan tayyorlangan sovuq sharbat.'
  },
  {
    _id: '7',
    name: 'Tiramisu Klasiko',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop',
    category: 'Desertlar',
    description: 'Maskarpone pishlog\'i, qahvaga botirilgan savoyardi pechenyelari va premium kakao kukuni bilan klassik italyan deserti.'
  },
  {
    _id: '8',
    name: 'Empire Chokolat torti',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
    category: 'Desertlar',
    description: 'Suyuq shokoladli yadro, yumshoq biskvit xamiri va vanilli muzqaymoq shari bilan shirinliklar imperiyasi taqdimoti.'
  }
];

const Foods = ({ selectedCategory, setSelectedCategory, setActiveTab }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Barchasi', 'Milliy taomlar', 'Fast food', 'Ichimliklar', 'Desertlar'];

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/foods`
        );
        if (response.ok) {
          const data = await response.json();
          // If server successfully returned items, use them. Otherwise, fallback.
          setFoods(data.length > 0 ? data : LOCAL_FALLBACK_FOODS);
        } else {
          setFoods(LOCAL_FALLBACK_FOODS);
        }
      } catch (error) {
        console.error('API ulana olmadi, lokal fallback ma\'lumotlar yuklanmoqda:', error.message);
        setFoods(LOCAL_FALLBACK_FOODS);
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
export { LOCAL_FALLBACK_FOODS };

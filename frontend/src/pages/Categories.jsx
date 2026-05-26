import React from 'react';
import { ChefHat, Pizza, Beer, IceCream } from 'lucide-react';

const Categories = ({ setActiveTab, setSelectedCategory }) => {
  const categoriesList = [
    {
      id: 'Milliy taomlar',
      name: 'Milliy Taomlar',
      description: 'Palov, somsa va asriy shohona o\'zbek taomlari',
      icon: <ChefHat className="w-6 h-6 text-restaurant-gold" />,
      bgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23D4AF37" opacity="0.05"><path d="M50 20 L80 80 L20 80 Z"/></svg>',
    },
    {
      id: 'Fast food',
      name: 'Fast Food',
      description: 'Lazzatli burgerlar, pitsalar va gazaklar',
      icon: <Pizza className="w-6 h-6 text-restaurant-gold" />,
      bgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23D4AF37" opacity="0.05"><circle cx="50" cy="50" r="30"/></svg>',
    },
    {
      id: 'Ichimliklar',
      name: 'Ichimliklar',
      description: 'Salqin sharbatlar, premium qahva va choylar',
      icon: <Beer className="w-6 h-6 text-restaurant-gold" />,
      bgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23D4AF37" opacity="0.05"><rect x="30" y="20" width="40" height="60" rx="5"/></svg>',
    },
    {
      id: 'Desertlar',
      name: 'Desertlar',
      description: 'Shirinliklar, shokoladli tortlar va muzqaymoqlar',
      icon: <IceCream className="w-6 h-6 text-restaurant-gold" />,
      bgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23D4AF37" opacity="0.05"><path d="M50 15 A20 20 0 0 1 70 35 L50 85 L30 35 A20 20 0 0 1 50 15 Z"/></svg>',
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setActiveTab('foods');
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      <div>
        <span className="text-[9px] uppercase tracking-[0.2em] text-restaurant-gold font-bold">Kategoriyalar</span>
        <h2 className="font-serif font-semibold text-xl text-restaurant-text-primary mt-1">
          Yoqimli <span className="gold-gradient-text">Katalogimiz</span>
        </h2>
        <p className="text-xs text-restaurant-text-secondary mt-1">
          Istagingizga mos bo'limni tanlang va tansiq taomlarni kashf eting
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {categoriesList.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="group w-full relative overflow-hidden rounded-2xl border border-restaurant-border bg-restaurant-card hover:border-restaurant-gold/40 text-left p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-between gold-border-glow"
          >
            {/* Background design elements */}
            <div
              className="absolute right-0 bottom-0 w-24 h-24 bg-no-repeat bg-right bg-bottom opacity-50"
              style={{ backgroundImage: `url("${category.bgImage}")` }}
            />

            <div className="flex items-start gap-4 pr-4">
              <div className="p-3.5 rounded-xl border border-restaurant-gold/15 bg-restaurant-gold/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                {category.icon}
              </div>
              <div>
                <h3 className="font-serif font-semibold text-base text-restaurant-text-primary group-hover:text-restaurant-gold transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-[11px] text-restaurant-text-secondary mt-1 leading-relaxed max-w-[200px] sm:max-w-xs">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="text-restaurant-gold/60 group-hover:text-restaurant-gold transition-transform duration-300 group-hover:translate-x-1 font-serif text-lg pr-1">
              &rarr;
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;

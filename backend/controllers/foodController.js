const Food = require('../models/Food');

// @desc    Get all foods (optional category filter)
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    let foods = await Food.find(filter);
    
    // Auto-seed if database is empty and category is not filtered
    if (foods.length === 0 && !category) {
      const count = await Food.countDocuments();
      if (count === 0) {
        console.log('Seeding initial fallback foods to MongoDB...');
        const initialFoods = [
          {
            name: 'Texas Double BBQ Burger',
            price: 48000,
            image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop',
            category: 'Burgerlar',
            description: 'Ikki qavatli suvli mol go\'shti kotleti, cheddar pishlog\'i, dudlangan qo\'ziqorinlar va maxsus Texas BBQ sousi qo\'shilgan klassik burger.'
          },
          {
            name: 'Crispy Chicken Cheese Burger',
            price: 34000,
            image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=600&auto=format&fit=crop',
            category: 'Burgerlar',
            description: 'Qarsildoq tovuq filesi, yangi salat bargi, pomidor, tuzlangan bodring va maxsus pishloqli sous bilan tayyorlangan shirin burger.'
          },
          {
            name: 'Empire Gold Burger',
            price: 38000,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
            category: 'Burgerlar',
            description: 'Premium mol go\'shtidan kotlet, eritilgan cheddar pishlog\'i, yangi sabzavotlar va oltin rang maxsus sous bilan yumshoq bulochkada.'
          },
          {
            name: 'Qarsildoq Tovuqli Lavash',
            price: 28000,
            image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600&auto=format&fit=crop',
            category: 'Fast food',
            description: 'Yupqa lavash xamiri ichida qarsildoq tovuq bo\'laklari, bodring, pomidor, chipslar va oq sarimsoqpiyoz sousi.'
          },
          {
            name: 'Mojito Classic (0.4L)',
            price: 18000,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop',
            category: 'Ichimliklar',
            description: 'Yalpiz barglari, yangi laym bo\'laklari, shakar siropi va muz bilan tayyorlangan tetiklashtiruvchi alkogolsiz kokteyl.'
          },
          {
            name: 'Gilos Sharbati Fresh (0.3L)',
            price: 22000,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop',
            category: 'Ichimliklar',
            description: '100% tabiiy, yangi siqilgan pishgan giloslardan tayyorlangan sovuq sharbat.'
          },
          {
            name: 'Tiramisu Klasiko',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop',
            category: 'Desertlar',
            description: 'Maskarpone pishlog\'i, qahvaga botirilgan savoyardi pechenyelari va premium kakao kukuni bilan klassik italyan deserti.'
          },
          {
            name: 'Empire Chokolat torti',
            price: 28000,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
            category: 'Desertlar',
            description: 'Suyuq shokoladli yadro, yumshoq biskvit xamiri va vanilli muzqaymoq shari bilan shirinliklar imperiyasi taqdimoti.'
          }
        ];
        foods = await Food.insertMany(initialFoods);
      }
    }
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Taom topilmadi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new food
// @route   POST /api/foods
// @access  Private/Admin
const createFood = async (req, res) => {
  const { name, price, image, category, description } = req.body;

  try {
    const food = new Food({
      name,
      price,
      image,
      category,
      description,
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
  const { name, price, image, category, description } = req.body;

  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = name || food.name;
      food.price = price || food.price;
      food.image = image || food.image;
      food.category = category || food.category;
      food.description = description || food.description;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Taom topilmadi' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await food.deleteOne();
      res.json({ message: 'Taom muvaffaqiyatli o\'chirildi' });
    } else {
      res.status(404).json({ message: 'Taom topilmadi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};

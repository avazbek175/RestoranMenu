const Food = require('../models/Food');

// @desc    Get all foods (optional category filter)
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    let foods = await Food.find(filter);
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

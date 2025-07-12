const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({
      name,
      user: req.user.id
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear categoría' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) return res.status(404).json({ message: 'Categoría no encontrada' });

    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar categoría' });
  }
};

const Expense = require('../models/expense.model');

// Crear un gasto
exports.createExpense = async (req, res) => {
  try {
    const { amount, description, category, date, dueDate, paid } = req.body;

 const expense = new Expense({
  user: req.user.id,
  amount,
  description,
  category,
  date,
  dueDate,
  paid : paid || false
});

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear gasto' });
  }
};

// Obtener todos los gastos del usuario
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
  .sort({ date: -1 })
  .populate('category', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener gastos' });
  }
};

// Editar un gasto
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Gasto no encontrado' });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar gasto' });
  }
};

// Eliminar un gasto
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) return res.status(404).json({ message: 'Gasto no encontrado' });

    res.json({ message: 'Gasto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar gasto' });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error al generar reporte mensual' });
  }
};

exports.getCategoryReport = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          total: 1
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error al generar reporte por categoría' });
  }
};

exports.getUpcomingExpenses = async (req, res) => {
  try {
    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    const expenses = await Expense.find({
      user: req.user._id,
      dueDate: { $gte: now, $lte: next7Days }
    }).sort({ dueDate: 1 }).populate('category', 'name');

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar gastos próximos a vencer' });
  }
};

// GET /api/expenses/unpaid
exports.getUnpaidExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
      paid: false
    }).sort({ dueDate: 1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener gastos impagos' });
  }
};

// GET /api/expenses/paid
exports.getPaidExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
      paid: true
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener gastos pagados' });
  }
};

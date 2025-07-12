const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth); // Todas las rutas están protegidas

router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/report/monthly', expenseController.getMonthlyReport);
router.get('/report/by-category', expenseController.getCategoryReport);
router.get('/report/upcoming', expenseController.getUpcomingExpenses);
router.get('/paid', expenseController.getPaidExpenses);
router.get('/unpaid', expenseController.getUnpaidExpenses);

module.exports = router;

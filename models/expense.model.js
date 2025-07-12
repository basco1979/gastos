const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category'
},
dueDate: {
  type: Date
},
paid: {
  type: Boolean,
  default: false
},
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);

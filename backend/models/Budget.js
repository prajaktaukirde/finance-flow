import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  allocated: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: '💰'
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
}, {
  timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;

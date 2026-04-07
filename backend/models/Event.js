import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  id: String,
  name: String,
  avatar: String,
  paid: { type: Number, default: 0 },
  owes: { type: Number, default: 0 },
  email: String
});

const expenseSchema = new mongoose.Schema({
  id: String,
  description: String,
  amount: Number,
  paidBy: String,
  date: String,
  splitType: { type: String, enum: ['equal', 'custom', 'selective'], default: 'equal' },
  customSplits: { type: Map, of: Number },
  selectedMembers: [String],
  isSettlement: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  icon: {
    type: String,
    default: '📅'
  },
  status: {
    type: String,
    enum: ['active', 'settled'],
    default: 'active'
  },
  members: [memberSchema],
  expenses: [expenseSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
export default Event;

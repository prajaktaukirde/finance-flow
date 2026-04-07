import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
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
  target: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  icon: {
    type: String,
    default: '🎯'
  },
  color: {
    type: String,
    default: '#22c55e'
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;

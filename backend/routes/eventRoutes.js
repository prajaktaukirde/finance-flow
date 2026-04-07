import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  addExpense,
  deleteExpense
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.get('/:id', protect, getEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/expenses', protect, addExpense);
router.delete('/:id/expenses/:expenseId', protect, deleteExpense);

export default router;

import express from 'express';
import { googleAuth } from '../controllers/googleAuthController.js';

const router = express.Router();

// POST /api/auth/google
router.post('/', googleAuth);

export default router;

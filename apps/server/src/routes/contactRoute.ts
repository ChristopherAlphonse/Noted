import express from 'express';
import { contactUs } from '../controllers/contactController';
import protect from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, contactUs);

export default router;


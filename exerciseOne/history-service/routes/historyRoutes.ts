// history-service/routes/historyRoutes.ts
import express from 'express';
import { historyController } from '../controllers/historyController';

const router = express.Router();

router.post('/history', historyController.createHistory);
router.get('/history', historyController.getHistory);

export default router;

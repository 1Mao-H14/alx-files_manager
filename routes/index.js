import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// GET /status => Check Redis and DB status
router.get('/status', AppController.getStatus);

// GET /stats => Get user and file counts
router.get('/stats', AppController.getStats);

export default router;

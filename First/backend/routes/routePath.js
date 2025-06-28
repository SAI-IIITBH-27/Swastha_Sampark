// backend/routes/routeRoutes.js
import express from 'express';
import { getRoute } from '../controllers/routeController.js';

const router = express.Router();

router.post('/', getRoute);

export default router;

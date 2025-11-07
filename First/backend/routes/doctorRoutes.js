import express from 'express';
import { registerDoctor, loginDoctor, getDoctors } from '../controllers/doctor.controller.js';

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/', getDoctors);

export default router;

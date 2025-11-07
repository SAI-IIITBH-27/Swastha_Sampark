import express from 'express';
import { registerPatient, loginPatient, getPatients } from '../controllers/patient.controller.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.get('/', getPatients);

export default router;

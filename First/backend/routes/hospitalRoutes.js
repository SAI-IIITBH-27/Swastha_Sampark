import express from 'express';
import { registerHospital, loginHospital, getHospitals, updateAvailability, importHospitalsFromJSON } from '../controllers/hospital.controller.js';
import { authHospitalMiddleware } from '../utils/auth.js';

const router = express.Router();

// register/login
router.post('/register', registerHospital);
router.post('/login', loginHospital);

// admin/import - one time
router.post('/import', importHospitalsFromJSON);

// public list
router.get('/', getHospitals);

// update availability (protected)
router.patch('/:id/availability', authHospitalMiddleware, updateAvailability);

export default router;

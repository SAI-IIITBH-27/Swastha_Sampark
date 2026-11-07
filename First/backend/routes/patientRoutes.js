import express from 'express';
import {
  registerPatient,
  registerHospitalPatient,
  loginPatient,
  getPatientProfile,
  changePatientPassword,
  getHospitalPatients,
  getHospitalPatientOverview,
  getHospitalPatientStats,
  getHospitalPatient,
  updateHospitalPatientStatus,
  assignHospitalPatientDoctor,
} from '../controllers/patient.controller.js';
import { authMiddleware, authHospitalMiddleware } from '../utils/auth.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.post('/change-password', authMiddleware, changePatientPassword);
router.post('/hospital', authHospitalMiddleware, registerHospitalPatient);
router.get('/hospital/overview', authHospitalMiddleware, getHospitalPatientOverview);
router.get('/hospital', authHospitalMiddleware, getHospitalPatients);
router.get('/hospital/stats', authHospitalMiddleware, getHospitalPatientStats);
router.get('/hospital/:id', authHospitalMiddleware, getHospitalPatient);
router.patch('/hospital/:id/status', authHospitalMiddleware, updateHospitalPatientStatus);
router.patch('/hospital/:id/doctor', authHospitalMiddleware, assignHospitalPatientDoctor);
router.get('/', authHospitalMiddleware, getHospitalPatients);
router.get('/:id', authMiddleware, getPatientProfile);

export default router;

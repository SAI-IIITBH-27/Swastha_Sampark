import express from 'express';
import {
  registerDoctor,
  registerHospitalDoctor,
  loginDoctor,
  changeDoctorPassword,
  getDoctors,
  getHospitalDoctors,
  getDoctorWorkspace,
  createDoctorAppointment,
  createDoctorTreatment,
  createDoctorPrescription,
  updateDoctorPatientStatus,
} from '../controllers/doctor.controller.js';
import { authDoctorMiddleware, authHospitalMiddleware } from '../utils/auth.js';

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/hospital', authHospitalMiddleware, registerHospitalDoctor);
router.post('/login', loginDoctor);
router.get('/', getDoctors);
router.get('/hospital', authHospitalMiddleware, getHospitalDoctors);
router.get('/workspace', authDoctorMiddleware, getDoctorWorkspace);
router.post('/change-password', authDoctorMiddleware, changeDoctorPassword);
router.post('/appointments', authDoctorMiddleware, createDoctorAppointment);
router.post('/treatments', authDoctorMiddleware, createDoctorTreatment);
router.post('/prescriptions', authDoctorMiddleware, createDoctorPrescription);
router.patch('/patients/:id/status', authDoctorMiddleware, updateDoctorPatientStatus);

export default router;

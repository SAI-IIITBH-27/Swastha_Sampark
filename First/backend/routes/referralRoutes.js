import express from 'express';
import { createReferral, hospitalAction, getReferralsForHospital, getReferralStats, getReferralsForPatient, getReferralsForDoctor } from '../controllers/referral.controller.js';
import { authHospitalMiddleware, authMiddleware } from '../utils/auth.js';

const router = express.Router();

// create referral (from doctors/frontend)
router.post('/', createReferral);
router.post('/hospital', authHospitalMiddleware, createReferral);

// hospital actions on referral (protected)
router.post('/:id/action', authHospitalMiddleware, hospitalAction);

// fetch referrals for logged-in hospital
router.get('/mine', authHospitalMiddleware, getReferralsForHospital);

// public stats
router.get('/stats', getReferralStats);

// referrals for a patient
router.get('/patient/:id', authMiddleware, getReferralsForPatient);

// referrals for a doctor
router.get('/doctor/:id', getReferralsForDoctor);

export default router;

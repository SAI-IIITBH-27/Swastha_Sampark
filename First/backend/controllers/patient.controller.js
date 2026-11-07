import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/patient.model.js';
import Referral from '../models/referral.model.js';
import Doctor from '../models/doctor.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const PATIENT_STATUSES = ['Admitted', 'Under Treatment', 'Under Observation', 'Referred', 'Discharged'];

const createTemporaryPassword = () => crypto.randomBytes(9).toString('base64url');

const patientView = (patient) => ({
  id: patient._id,
  _id: patient._id,
  name: patient.name,
  email: patient.email,
  phone: patient.phone,
  age: patient.age,
  dateOfBirth: patient.dateOfBirth,
  gender: patient.gender,
  address: patient.address,
  bloodGroup: patient.bloodGroup,
  medicalHistory: patient.medicalHistory,
  hospital: patient.hospital,
  admissionDate: patient.admissionDate,
  status: patient.status,
  assignedDoctor: patient.assignedDoctor,
});

const findDuplicate = async ({ email, phone }) => {
  const identifiers = [];
  if (email) identifiers.push({ email: email.trim().toLowerCase() });
  if (phone) identifiers.push({ phone: phone.trim() });
  return identifiers.length ? Patient.findOne({ $or: identifiers }) : null;
};

const savePatient = async (data, hospitalId = null) => {
  const { name, email, password, phone, age, dateOfBirth, gender, address, bloodGroup, medicalHistory } = data;
  if (!name || (!email && !phone)) {
    const error = new Error('Full name and email or phone are required');
    error.status = 400;
    throw error;
  }

  const duplicate = await findDuplicate({ email, phone });
  if (duplicate) {
    const error = new Error('A patient with that email or phone already exists');
    error.status = 409;
    throw error;
  }

  const temporaryPassword = password || createTemporaryPassword();
  const patient = new Patient({
    name: name.trim(),
    email: email ? email.trim().toLowerCase() : undefined,
    phone: phone ? phone.trim() : undefined,
    age: age ? Number(age) : undefined,
    dateOfBirth: dateOfBirth || undefined,
    gender,
    address,
    bloodGroup,
    medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : (medicalHistory ? [medicalHistory] : []),
    password: await bcrypt.hash(temporaryPassword, 12),
    mustChangePassword: !password,
    hospital: hospitalId || undefined,
  });
  await patient.save();
  return { patient, temporaryPassword: password ? null : temporaryPassword };
};

export const registerPatient = async (req, res) => {
  try {
    const { patient, temporaryPassword } = await savePatient(req.body);
    res.status(201).json({
      message: 'Patient registered',
      patient: patientView(patient),
      ...(temporaryPassword ? { temporaryPassword } : {}),
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.status ? err.message : 'Server error' });
  }
};

export const registerHospitalPatient = async (req, res) => {
  try {
    const { patient, temporaryPassword } = await savePatient(req.body, req.hospitalId);
    const populated = await patient.populate('assignedDoctor', 'name specialization');
    res.status(201).json({
      message: 'Patient registered with this hospital',
      patient: patientView(populated),
      temporaryPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.status ? err.message : 'Server error' });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || phone || '').trim();
    const query = loginIdentifier.includes('@')
      ? { email: loginIdentifier.toLowerCase() }
      : { $or: [{ phone: loginIdentifier }, { email: loginIdentifier.toLowerCase() }] };
    const patient = await Patient.findOne(query);
    if (!patient || !(await bcrypt.compare(password || '', patient.password || ''))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({
      token,
      mustChangePassword: patient.mustChangePassword,
      patient: { ...patientView(patient), mustChangePassword: patient.mustChangePassword },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatientProfile = async (req, res) => {
  try {
    if (req.user.role !== 'patient' || req.user.id !== req.params.id) return res.status(403).json({ message: 'Patient profile access denied' });
    const patient = await Patient.findById(req.params.id)
      .select('-password -mustChangePassword')
      .populate('hospital', 'name location phone email')
      .populate('referredTo', 'name location phone email')
      .populate('assignedDoctor', 'name specialization email phone');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePatientPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });
    const patient = await Patient.findById(req.user.id);
    if (!patient || !(await bcrypt.compare(currentPassword || '', patient.password || ''))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    patient.password = await bcrypt.hash(newPassword, 12);
    patient.mustChangePassword = false;
    await patient.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitalPatients = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { hospital: req.hospitalId };
    if (status && PATIENT_STATUSES.includes(status)) query.status = status;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    const patients = await Patient.find(query)
      .select('-password -mustChangePassword')
      .populate('assignedDoctor', 'name specialization')
      .sort({ admissionDate: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitalPatientOverview = async (req, res) => {
  try {
    const hospitalId = req.hospitalId;
    const patientFields = '-password -mustChangePassword';
    const [admittedTreatment, referredTo, referredBy] = await Promise.all([
      Patient.find({
        hospital: hospitalId,
        status: { $in: ['Admitted', 'Under Treatment', 'Under Observation'] },
      }).select(patientFields).populate('assignedDoctor', 'name specialization').sort({ admissionDate: -1 }),
      Referral.find({
        toHospital: hospitalId,
        status: { $in: ['pending', 'accepted', 'passed'] },
      }).populate('patient fromHospital fromDoctor toDoctor', 'name specialization location').sort({ createdAt: -1 }),
      Referral.find({ fromHospital: hospitalId })
        .populate('patient toHospital fromDoctor', 'name specialization location')
        .sort({ createdAt: -1 }),
    ]);
    res.json({ admittedTreatment, referredTo, referredBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitalPatientStats = async (req, res) => {
  try {
    const grouped = await Patient.aggregate([
      { $match: { hospital: req.hospitalId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const stats = Object.fromEntries(PATIENT_STATUSES.map((status) => [status, 0]));
    grouped.forEach(({ _id, count }) => { if (_id) stats[_id] = count; });
    res.json({ total: Object.values(stats).reduce((sum, count) => sum + count, 0), byStatus: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitalPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, hospital: req.hospitalId })
      .select('-password -mustChangePassword')
      .populate('assignedDoctor', 'name specialization');
    if (!patient) return res.status(404).json({ message: 'Patient not found in this hospital' });
    const referrals = await Referral.find({ patient: patient._id })
      .populate('fromHospital toHospital fromDoctor toDoctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json({ patient, referrals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHospitalPatientStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!PATIENT_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid patient status' });
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, hospital: req.hospitalId },
      { status, ...(status === 'Admitted' && !req.body.admissionDate ? { admissionDate: new Date() } : {}) },
      { new: true, runValidators: true },
    ).select('-password -mustChangePassword').populate('assignedDoctor', 'name specialization');
    if (!patient) return res.status(404).json({ message: 'Patient not found in this hospital' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignHospitalPatientDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patient = await Patient.findOne({ _id: req.params.id, hospital: req.hospitalId });
    if (!patient) return res.status(404).json({ message: 'Patient not found in this hospital' });
    if (doctorId) {
      const doctor = await Doctor.findOne({ _id: doctorId, hospital: req.hospitalId, active: true });
      if (!doctor) return res.status(400).json({ message: 'Doctor does not belong to this hospital' });
    }
    patient.assignedDoctor = doctorId || null;
    await patient.save();
    res.json(await patient.populate('assignedDoctor', 'name specialization email'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatients = getHospitalPatients;

export default {
  registerPatient,
  registerHospitalPatient,
  loginPatient,
  getPatientProfile,
  changePatientPassword,
  getPatients,
  getHospitalPatients,
  getHospitalPatientOverview,
  getHospitalPatientStats,
  getHospitalPatient,
  updateHospitalPatientStatus,
  assignHospitalPatientDoctor,
};

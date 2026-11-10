import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';
import Appointment from '../models/appointment.model.js';
import Treatment from '../models/treatment.model.js';
import Prescription from '../models/prescription.model.js';
import Referral from '../models/referral.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, phone, hospitalId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name,email,password required' });
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Doctor already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const d = new Doctor({ name, email, phone, specialization, hospital: hospitalId, password: hashed });
    await d.save();
    res.json({ message: 'Doctor registered', doctor: { id: d._id, name: d.name, email: d.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerHospitalDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, password, schedule } = req.body;
    if (!name || !email || !specialization) return res.status(400).json({ message: 'name, email and specialization are required' });
    const existing = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'A doctor with that email already exists' });
    const temporaryPassword = password || crypto.randomBytes(9).toString('base64url');
    const doctor = new Doctor({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      specialization: specialization.trim(),
      hospital: req.hospitalId,
      password: await bcrypt.hash(temporaryPassword, 12),
      mustChangePassword: true,
      schedule: Array.isArray(schedule) ? schedule : [],
    });
    await doctor.save();
    res.status(201).json({
      message: 'Doctor created',
      temporaryPassword,
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, specialization: doctor.specialization, hospital: doctor.hospital },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const d = await Doctor.findOne({ email });
    if (!d) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, d.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: d._id, role: 'doctor' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, doctor: { id: d._id, name: d.name, email: d.email, specialization: d.specialization, hospital: d.hospital, mustChangePassword: d.mustChangePassword } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changeDoctorPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ message: 'Current password and a new password of at least 8 characters are required' });
    const doctor = await Doctor.findById(req.doctorId);
    if (!doctor || !(await bcrypt.compare(currentPassword, doctor.password || ''))) return res.status(401).json({ message: 'Current password is incorrect' });
    doctor.password = await bcrypt.hash(newPassword, 12);
    doctor.mustChangePassword = false;
    await doctor.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitalDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospital: req.hospitalId }).select('-password').sort({ name: 1 });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const doctorScopedAppointment = (doctorId, id) => ({ _id: id, doctor: doctorId });

export const getDoctorWorkspace = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const [doctor, patients, appointments, treatments, prescriptions, referredPatients] = await Promise.all([
      Doctor.findById(doctorId).select('-password').populate('hospital', 'name location'),
      Patient.find({ assignedDoctor: doctorId }).select('-password -mustChangePassword').sort({ updatedAt: -1 }),
      Appointment.find({ doctor: doctorId, hospital: req.hospitalId }).populate('patient', 'name age gender status').sort({ date: 1, time: 1 }),
      Treatment.find({ doctor: doctorId }).populate({ path: 'appointment', populate: { path: 'patient', select: 'name age gender status' } }).sort({ createdAt: -1 }),
      Prescription.find({ doctor: doctorId }).populate({ path: 'appointment', populate: { path: 'patient', select: 'name' } }).sort({ createdAt: -1 }),
      Patient.find({ assignedDoctor: doctorId }).select('-password -mustChangePassword').sort({ updatedAt: -1 }),
    ]);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const todayAppointments = appointments.filter((appointment) => appointment.date && appointment.date >= start && appointment.date < end);
    const statusCounts = patients.reduce((counts, patient) => {
      counts[patient.status] = (counts[patient.status] || 0) + 1;
      return counts;
    }, {});
    res.json({
      doctor,
      patients,
      appointments,
      treatments,
      prescriptions,
      referredPatients,
      statistics: {
        totalPatients: patients.length,
        activeCases: patients.filter((patient) => ['Admitted', 'Under Treatment', 'Under Observation'].includes(patient.status)).length,
        completedCases: patients.filter((patient) => patient.status === 'Discharged').length,
        todayAppointments: todayAppointments.length,
        statusCounts,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createDoctorAppointment = async (req, res) => {
  try {
    const { patientId, date, time, notes } = req.body;
    const patient = await Patient.findOne({ _id: patientId, assignedDoctor: req.doctorId, hospital: req.hospitalId });
    if (!patient) return res.status(403).json({ message: 'Patient is not assigned to this doctor' });
    const appointment = await Appointment.create({ patient: patient._id, doctor: req.doctorId, hospital: req.hospitalId, date, time, notes });
    res.status(201).json(await appointment.populate('patient', 'name age gender status'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createDoctorTreatment = async (req, res) => {
  try {
    const { appointmentId, description, diagnosis, followUpDate } = req.body;
    const appointment = await Appointment.findOne(doctorScopedAppointment(req.doctorId, appointmentId)).populate('patient');
    if (!appointment || String(appointment.hospital) !== String(req.hospitalId)) return res.status(404).json({ message: 'Appointment not found' });
    const treatment = await Treatment.create({ appointment: appointment._id, description, diagnosis, followUpDate, doctor: req.doctorId });
    await Patient.findByIdAndUpdate(appointment.patient._id, { status: 'Under Treatment' });
    res.status(201).json(await treatment.populate({ path: 'appointment', populate: { path: 'patient', select: 'name age gender status' } }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createDoctorPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;
    if (!Array.isArray(medicines) || !medicines.length) return res.status(400).json({ message: 'At least one medicine is required' });
    const appointment = await Appointment.findOne(doctorScopedAppointment(req.doctorId, appointmentId)).populate('patient');
    if (!appointment || String(appointment.hospital) !== String(req.hospitalId)) return res.status(404).json({ message: 'Appointment not found' });
    const prescription = await Prescription.create({ appointment: appointment._id, medicines, notes, doctor: req.doctorId });
    res.status(201).json(await prescription.populate({ path: 'appointment', populate: { path: 'patient', select: 'name' } }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDoctorPatientStatus = async (req, res) => {
  try {
    const allowed = ['Admitted', 'Under Treatment', 'Under Observation', 'Discharged'];
    const { status } = req.body;
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid patient status' });
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, assignedDoctor: req.doctorId, hospital: req.hospitalId },
      { status },
      { new: true, runValidators: true },
    ).select('-password -mustChangePassword').populate('assignedDoctor', 'name specialization');
    if (!patient) return res.status(404).json({ message: 'Assigned patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { registerDoctor, registerHospitalDoctor, loginDoctor, changeDoctorPassword, getDoctors, getHospitalDoctors, getDoctorWorkspace, createDoctorAppointment, createDoctorTreatment, createDoctorPrescription, updateDoctorPatientStatus };

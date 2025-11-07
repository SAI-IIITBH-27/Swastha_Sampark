import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/patient.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, address } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'name and email required' });
    const existing = await Patient.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Patient already exists' });
    const secret = password || Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(secret, 10);
    const p = new Patient({ name, email, phone, age, gender, address, password: hashed });
    await p.save();
    res.json({ message: 'Patient registered', patient: { id: p._id, name: p.name, email: p.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const p = await Patient.findOne({ email });
    if (!p) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, p.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: p._id, role: 'patient' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, patient: { id: p._id, name: p.name, email: p.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { registerPatient, loginPatient, getPatients };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Doctor from '../models/doctor.model.js';

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

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const d = await Doctor.findOne({ email });
    if (!d) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, d.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: d._id, role: 'doctor' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, doctor: { id: d._id, name: d.name, email: d.email } });
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

export default { registerDoctor, loginDoctor, getDoctors };

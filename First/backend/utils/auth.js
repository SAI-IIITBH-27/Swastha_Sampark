import jwt from 'jsonwebtoken';
import Hospital from '../models/hospital.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// generic token auth - attaches req.user = { id, role }
export const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });

    req.user = { id: decoded.id, role: decoded.role || decoded.email || 'unknown' };
    next();
  } catch (err) {
    console.error('auth error', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export const authHospitalMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });

    const hosp = await Hospital.findById(decoded.id);
    if (!hosp) return res.status(401).json({ message: 'Hospital not found' });

    req.hospitalId = hosp._id;
    req.hospital = hosp;
    next();
  } catch (err) {
    console.error('auth error', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authHospitalMiddleware;

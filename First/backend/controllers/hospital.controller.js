import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Hospital from '../models/hospital.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const registerHospital = async (req, res) => {
  try {
    const { name, email, password, location, specialty, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });

    const existing = await Hospital.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Hospital with that email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const hosp = new Hospital({ name, email, password: hashed, location, specialty, phone });
    await hosp.save();
    res.json({ message: 'Hospital registered', hospital: { id: hosp._id, name: hosp.name, email: hosp.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Hospital login attempt for email:', email);
    const hosp = await Hospital.findOne({ email });
    if (!hosp) {
      console.log('No hospital found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Found hospital id:', hosp._id.toString(), 'hasPassword:', !!hosp.password);
    const ok = await bcrypt.compare(password, hosp.password || '');
    console.log('bcrypt.compare result for email', email, ':', ok);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: hosp._id, email: hosp.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, hospital: { id: hosp._id, name: hosp.name, status: hosp.status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select('-password');
    res.json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hosp = await Hospital.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    if (!hosp) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hosp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Import hospitals from frontend JSON file into MongoDB (one-time)
export const importHospitalsFromJSON = async (req, res) => {
  try {
    // assume backend process.cwd() is backend directory; adjust path to frontend asset
    const jsonPath = path.resolve(process.cwd(), '../my-app/src/assets/db.json');
    if (!fs.existsSync(jsonPath)) return res.status(400).json({ message: 'db.json not found at expected path: ' + jsonPath });

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);
    const list = data.hospitals || [];

    const ops = list.map(h => ({
      updateOne: {
        filter: { name: h.name },
        update: { $set: { name: h.name, location: h.location, specialty: h.specialty, status: h.status, meta: h } },
        upsert: true,
      }
    }));

    if (ops.length) {
      const result = await Hospital.bulkWrite(ops);
      const upserted = result.upsertedCount || result.nUpserted || 0;
      const modified = result.modifiedCount || result.nModified || 0;
      return res.json({ importedOps: ops.length, upserted, modified, rawResult: result });
    }
    res.json({ importedOps: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to import hospitals' });
  }
};

export default { registerHospital, loginHospital, getHospitals, updateAvailability, importHospitalsFromJSON };

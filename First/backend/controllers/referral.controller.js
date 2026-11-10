import Referral from '../models/referral.model.js';
import Hospital from '../models/hospital.model.js';
import Patient from '../models/patient.model.js';

// create a new referral
export const createReferral = async (req, res) => {
  try {
    const { patient, fromDoctor, fromHospital, toDoctor, toHospitalId, reason } = req.body;
    if (!patient || !toHospitalId) return res.status(400).json({ message: 'Patient and destination hospital are required' });
    const sourceHospital = req.hospitalId || fromHospital;
    if (req.hospitalId && fromHospital && String(req.hospitalId) !== String(fromHospital)) {
      return res.status(403).json({ message: 'Referral source hospital does not match authenticated hospital' });
    }
    const patientRecord = await Patient.findById(patient);
    if (!patientRecord) return res.status(404).json({ message: 'Patient not found' });
    if (req.hospitalId && (!patientRecord.hospital || String(patientRecord.hospital) !== String(req.hospitalId))) {
      return res.status(403).json({ message: 'Patient does not belong to this hospital' });
    }
    // allow storing originating hospital as well (optional)
    const refer = new Referral({ patient, fromDoctor, fromHospital: sourceHospital, toDoctor, toHospital: toHospitalId, reason });
    await refer.save();
    await Patient.findByIdAndUpdate(patient, {
      status: 'Referred',
      referredTo: toHospitalId,
      referredAt: new Date(),
    });
    res.json({ message: 'Referral created', referral: refer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// hospital performs action on referral (accept/reject/pass)
export const hospitalAction = async (req, res) => {
  try {
    const { id } = req.params; // referral id
    const { action, message } = req.body; // action: accept|reject|pass
    const hospitalId = req.hospitalId; // set by auth middleware

    const referral = await Referral.findById(id);
    if (!referral) return res.status(404).json({ message: 'Referral not found' });
    if (!referral.toHospital || String(referral.toHospital) !== String(hospitalId)) {
      return res.status(403).json({ message: 'Only the receiving hospital can process this referral' });
    }

    if (!['accept','reject','pass'].includes(action)) return res.status(400).json({ message: 'Invalid action' });

    let status = 'pending';
    if (action === 'accept') status = 'accepted';
    if (action === 'reject') status = 'rejected';
    if (action === 'pass') status = 'passed';

    referral.status = status;
    referral.hospitalResponse = { message, action, by: hospitalId, updatedAt: new Date() };
    await referral.save();

    if (action === 'accept') {
      await Patient.findByIdAndUpdate(referral.patient, {
        hospital: hospitalId,
        status: 'Admitted',
        admissionDate: new Date(),
        referredTo: null,
        referredAt: null,
      });
    } else if (action === 'reject') {
      await Patient.findByIdAndUpdate(referral.patient, {
        status: 'Admitted',
        referredTo: null,
        referredAt: null,
      });
    }

    // optionally update hospital availability when accepted
    if (status === 'accepted') {
      await Hospital.findByIdAndUpdate(hospitalId, { status: 'Busy' });
    }

    res.json({ message: 'Referral updated', referral });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReferralsForHospital = async (req, res) => {
  try {
    const hospitalId = req.hospitalId;
    const referrals = await Referral.find({ toHospital: hospitalId }).populate('patient fromDoctor toDoctor').sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReferralsForPatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    if (!req.user || req.user.role !== 'patient' || req.user.id !== patientId) {
      return res.status(403).json({ message: 'Patient referral access denied' });
    }
    const referrals = await Referral.find({ patient: patientId }).populate('patient fromDoctor fromHospital toDoctor toHospital').sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReferralsForDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const referrals = await Referral.find({ $or: [{ fromDoctor: doctorId }, { toDoctor: doctorId }] }).populate('patient fromDoctor fromHospital toDoctor toHospital').sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReferralStats = async (req, res) => {
  try {
    // aggregate referrals grouped by hospital
    const stats = await Referral.aggregate([
      { $match: { toHospital: { $ne: null } } },
      { $group: { _id: '$toHospital', count: { $sum: 1 }, patients: { $addToSet: '$patient' } } },
    ]);

    // populate hospital and patient names
    const populated = [];
    for (const s of stats) {
      const hosp = await Hospital.findById(s._id).select('name');
      const patients = await Referral.find({ toHospital: s._id }).distinct('patient');
      populated.push({ hospital: hosp ? { id: hosp._id, name: hosp.name } : { id: s._id }, count: s.count, patientIds: patients });
    }

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReferredPatientsForDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const referrals = await Referral.find({ toDoctor: doctorId, status: 'accepted' })
      .populate('patient', 'name age gender medicalHistory')
      .sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { createReferral, hospitalAction, getReferralsForHospital, getReferredPatientsForDoctor };

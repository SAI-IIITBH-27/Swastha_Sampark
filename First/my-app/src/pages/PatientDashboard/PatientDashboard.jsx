import React, { useEffect, useState } from 'react';
import { get } from '../../services/apiClient';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    get('/api/patients')
      .then(setPatients)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;
    get(`/api/referrals/patient/${selectedPatient}`)
      .then(setReferrals)
      .catch(console.error);
  }, [selectedPatient]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>
      <div className="mb-4">
        <label className="block mb-2">Select patient</label>
        <select className="p-2 border" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          <option value="">-- choose patient --</option>
          {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email || p._id})</option>)}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Referrals</h3>
        {referrals.length === 0 && <p>No referrals found for this patient.</p>}
        {referrals.map(r => (
          <div key={r._id} className="border p-3 rounded mb-2">
            <p><strong>From Hospital:</strong> {r.fromHospital ? r.fromHospital.name : 'N/A'}</p>
            <p><strong>To Hospital:</strong> {r.toHospital ? r.toHospital.name : 'N/A'}</p>
            <p><strong>From Doctor:</strong> {r.fromDoctor ? r.fromDoctor.name || r.fromDoctor : 'N/A'}</p>
            <p><strong>Reason:</strong> {r.reason}</p>
            <p><strong>Status:</strong> {r.status}</p>
            <p><strong>Created:</strong> {new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;

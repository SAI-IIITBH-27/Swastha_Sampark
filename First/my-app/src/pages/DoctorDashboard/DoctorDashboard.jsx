import React, { useEffect, useState } from 'react';
import { get } from '../../services/apiClient';

const DoctorDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    get('/api/doctors')
      .then(setDoctors)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedDoctor) return;
    get(`/api/referrals/doctor/${selectedDoctor}`)
      .then(setReferrals)
      .catch(console.error);
  }, [selectedDoctor]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
      <div className="mb-4">
        <label className="block mb-2">Select doctor</label>
        <select className="p-2 border" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
          <option value="">-- choose doctor --</option>
          {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.email || d._id})</option>)}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Referrals</h3>
        {referrals.length === 0 && <p>No referrals found for this doctor.</p>}
        {referrals.map(r => (
          <div key={r._id} className="border p-3 rounded mb-2">
            <p><strong>Patient:</strong> {r.patient ? r.patient.name : r.patient}</p>
            <p><strong>From Hospital:</strong> {r.fromHospital ? r.fromHospital.name : 'N/A'}</p>
            <p><strong>To Hospital:</strong> {r.toHospital ? r.toHospital.name : 'N/A'}</p>
            <p><strong>Reason:</strong> {r.reason}</p>
            <p><strong>Status:</strong> {r.status}</p>
            <p><strong>Created:</strong> {new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;

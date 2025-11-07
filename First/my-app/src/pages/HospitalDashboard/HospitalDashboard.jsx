import React, { useEffect, useState } from 'react';
import { get, post } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const HospitalDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [hospital, setHospital] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [referrals, setReferrals] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [toHospitalId, setToHospitalId] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    // load hospitals (for referring out) and patients
    get('/api/hospitals')
      .then((list) => {
        const selfId = hospital ? (hospital.id || hospital._id) : null;
        setHospitals(list.filter(h => !(selfId && (h._id === selfId || h.id === selfId))));
      })
      .catch(console.error);

    get('/api/patients')
      .then(setPatients)
      .catch(console.error);

    // load referrals for this hospital
    get('/api/referrals/mine')
      .then(setReferrals)
      .catch(console.error);
  }, [token, hospital]);

  const login = async () => {
    try {
      const json = await post('/api/hospitals/login', { email, password });
      setToken(json.token);
      localStorage.setItem('token', json.token);
      localStorage.setItem('role', 'hospital');
      setHospital(json.hospital);
      localStorage.setItem('user', JSON.stringify(json.hospital));
    } catch (err) {
      if (err && err.status === 401) alert('Login failed: Invalid credentials');
      else alert('Login error: ' + (err.message || err));
    }
  };

  const logout = () => {
    setToken('');
    setHospital(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    // reset form fields
    setReferrals([]);
    navigate('/register');
  };

  const createReferral = async () => {
    if (!selectedPatientId || !toHospitalId) { alert('Select patient and destination hospital'); return; }
    try {
      const body = { patient: selectedPatientId, fromHospital: hospital.id || hospital._id, toHospitalId, reason: notes || 'Referral from hospital dashboard' };
  await post('/api/referrals', body);
  alert('Referral created');
      // refresh referrals
  const refreshed = await get('/api/referrals/mine');
  if (refreshed) setReferrals(refreshed);
    } catch (err) { alert('Create error: ' + err.message); }
  };

  const actOnReferral = async (id, action) => {
    try {
      const updated = await post(`/api/referrals/${id}/action`, { action, message: action === 'accept' ? 'Accepted' : 'Rejected' });
      // refresh referrals
      setReferrals(prev => prev.map(r => (r._id === id ? updated.referral : r)));
    } catch (err) { alert('Action error: ' + err.message); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hospital Dashboard</h2>
      {!token && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Hospital Login</h3>
          <input className="border p-2 mr-2" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 mr-2" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white px-3 py-1" onClick={login}>Login</button>
        </div>
      )}

      {token && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="mb-2">Referrals {hospital ? `- ${hospital.name}` : ''}</h3>
            <div>
              <button className="bg-gray-600 text-white px-3 py-1 mr-2" onClick={logout}>Logout</button>
            </div>
          </div>

          <div className="border p-4 rounded mb-4">
            <h4 className="font-semibold mb-2">Refer a patient</h4>
            <div className="mb-2">
              <label className="block text-sm font-medium">Patient</label>
              <select className="w-full border p-2" value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)}>
                <option value="">-- select patient --</option>
                {patients.map(p => (<option key={p._id || p.id} value={p._id || p.id}>{p.name || p.fullName || (p.email || p._id)}</option>))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Destination Hospital</label>
              <select className="w-full border p-2" value={toHospitalId} onChange={e => setToHospitalId(e.target.value)}>
                <option value="">-- select hospital --</option>
                {hospitals.map(h => (<option key={h._id || h.id} value={h._id || h.id}>{h.name || h.hospitalName || h.email}</option>))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Notes / Reason</label>
              <textarea className="w-full border p-2" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div>
              <button className="bg-blue-600 text-white px-4 py-2" onClick={createReferral}>Create Referral</button>
            </div>
          </div>

          <h4 className="font-semibold mb-2">Incoming Referrals</h4>
          {referrals.length === 0 && <p>No referrals</p>}
          {referrals.map(r => (
            <div key={r._id} className="border p-3 rounded mb-2">
              <p><strong>Patient:</strong> {r.patient ? r.patient.name : r.patient}</p>
              <p><strong>From Hospital:</strong> {r.fromHospital ? r.fromHospital.name : 'N/A'}</p>
              <p><strong>From Doctor:</strong> {r.fromDoctor ? (r.fromDoctor.name || r.fromDoctor) : 'N/A'}</p>
              <p><strong>Reason:</strong> {r.reason}</p>
              <p><strong>Status:</strong> {r.status}</p>
              <div className="mt-2">
                <button className="bg-green-600 text-white px-3 py-1 mr-2" onClick={() => actOnReferral(r._id, 'accept')}>Accept</button>
                <button className="bg-red-600 text-white px-3 py-1" onClick={() => actOnReferral(r._id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;

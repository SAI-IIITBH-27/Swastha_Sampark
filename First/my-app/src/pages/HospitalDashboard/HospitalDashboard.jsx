import React, { useEffect, useState } from 'react';
import { get, post } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const Badge = ({ children, color = 'gray' }) => {
  const colorClasses = {
    green: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    red: 'bg-rose-100 text-rose-700 border border-rose-200',
    yellow: 'bg-amber-100 text-amber-700 border border-amber-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200'
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

const StatCard = ({ title, value, description, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className={`p-4 rounded-xl border-2 ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5m0 5h4"/>
        </svg>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500 mb-1 tracking-wide">{title}</div>
        <div className="text-3xl font-bold text-gray-800 font-sans">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{description}</div>
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState('incoming');
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
    setReferrals([]);
    navigate('/register');
  };

  const createReferral = async () => {
    if (!selectedPatientId || !toHospitalId) { alert('Select patient and destination hospital'); return; }
    try {
      const body = { patient: selectedPatientId, fromHospital: hospital.id || hospital._id, toHospitalId, reason: notes || 'Referral from hospital dashboard' };
      await post('/api/referrals', body);
      alert('Referral created successfully');
      // refresh referrals
      const refreshed = await get('/api/referrals/mine');
      if (refreshed) setReferrals(refreshed);
      // Reset form
      setSelectedPatientId('');
      setToHospitalId('');
      setNotes('');
    } catch (err) { alert('Create error: ' + err.message); }
  };

  const actOnReferral = async (id, action) => {
    try {
      const updated = await post(`/api/referrals/${id}/action`, { action, message: action === 'accept' ? 'Accepted' : 'Rejected' });
      // refresh referrals
      setReferrals(prev => prev.map(r => (r._id === id ? updated.referral : r)));
    } catch (err) { alert('Action error: ' + err.message); }
  };

  const incomingReferrals = referrals.filter(r => r.status === 'pending');
  const processedReferrals = referrals.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header with Website Name and Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-indigo-600 font-sans tracking-tight">Swastha Sampark</h1>
                <p className="text-sm text-slate-500 font-medium">Healthcare Connection Platform</p>
              </div>
            </div>
          </div>
          
          {token && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-xs border border-slate-200/60 font-medium">
                Last updated: {new Date().toLocaleDateString('en-GB')}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>

        {!token && (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200/60 max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center font-sans tracking-tight">Hospital Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                  placeholder="hospital@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input 
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                  placeholder="Enter your password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <button 
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 mt-4"
                onClick={login}
              >
                Sign In to Hospital Portal
              </button>
            </div>
          </div>
        )}

        {token && (
          <div>
            {/* Hospital Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-2 font-sans tracking-tight">Hospital Dashboard</h2>
                <p className="text-slate-600 text-lg font-light">Welcome back, {hospital?.name || 'Hospital'}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="TOTAL REFERRALS" 
                value={referrals.length} 
                description="All referrals"
                color="blue"
              />
              <StatCard 
                title="PENDING" 
                value={incomingReferrals.length} 
                description="Awaiting action"
                color="amber"
              />
              <StatCard 
                title="PROCESSED" 
                value={processedReferrals.length} 
                description="Completed cases"
                color="green"
              />
            </div>

            {/* Create Referral Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-slate-200/60">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 font-sans">Refer a Patient</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Patient</label>
                  <select 
                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                    value={selectedPatientId} 
                    onChange={e => setSelectedPatientId(e.target.value)}
                  >
                    <option value="">-- Select patient --</option>
                    {patients.map(p => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.name || p.fullName || (p.email || p._id)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Destination Hospital</label>
                  <select 
                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                    value={toHospitalId} 
                    onChange={e => setToHospitalId(e.target.value)}
                  >
                    <option value="">-- Select hospital --</option>
                    {hospitals.map(h => (
                      <option key={h._id || h.id} value={h._id || h.id}>
                        {h.name || h.hospitalName || h.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Medical Notes & Reason</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                  rows={4} 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter detailed medical reason for referral..."
                />
              </div>
              <button 
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                onClick={createReferral}
                disabled={!selectedPatientId || !toHospitalId}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                Create Referral
              </button>
            </div>

            {/* Referrals Tabs */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60">
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === 'incoming' 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('incoming')}
                >
                  Incoming Referrals ({incomingReferrals.length})
                </button>
                <button
                  className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                    activeTab === 'processed' 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('processed')}
                >
                  Processed Referrals ({processedReferrals.length})
                </button>
              </div>

              {activeTab === 'incoming' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Incoming Referrals</h3>
                  {incomingReferrals.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-300 text-6xl mb-4">📥</div>
                      <div className="text-slate-400 text-lg font-medium mb-2">No incoming referrals</div>
                      <div className="text-slate-300 text-sm">Pending referrals will appear here</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {incomingReferrals.map(r => (
                        <div key={r._id} className="border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="font-bold text-slate-800 text-lg">
                                  {r.patient ? r.patient.name : 'Patient'}
                                </div>
                                <Badge color="yellow">Pending</Badge>
                              </div>
                              <div className="text-sm text-slate-600 space-y-1">
                                <div><strong>From Hospital:</strong> {r.fromHospital ? r.fromHospital.name : 'N/A'}</div>
                                <div><strong>From Doctor:</strong> {r.fromDoctor ? (r.fromDoctor.name || r.fromDoctor) : 'N/A'}</div>
                              </div>
                            </div>
                            <div className="text-sm text-slate-400 font-medium">
                              {new Date(r.date || r.createdAt).toLocaleString('en-GB')}
                            </div>
                          </div>
                          <div className="text-slate-600 bg-slate-50/80 p-4 rounded-lg text-sm mb-4 border border-slate-200/60 font-medium">
                            {r.reason}
                          </div>
                          <div className="flex gap-3">
                            <button 
                              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2"
                              onClick={() => actOnReferral(r._id, 'accept')}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                              </svg>
                              Accept Referral
                            </button>
                            <button 
                              className="bg-rose-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2"
                              onClick={() => actOnReferral(r._id, 'reject')}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                              Reject Referral
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'processed' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Processed Referrals</h3>
                  {processedReferrals.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-slate-300 text-6xl mb-4">📋</div>
                      <div className="text-slate-400 text-lg font-medium mb-2">No processed referrals</div>
                      <div className="text-slate-300 text-sm">Completed referrals will appear here</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {processedReferrals.map(r => (
                        <div key={r._id} className="border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="font-bold text-slate-800 text-lg">
                                  {r.patient ? r.patient.name : 'Patient'}
                                </div>
                                <Badge color={r.status === 'accepted' ? 'green' : 'red'}>
                                  {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-600 space-y-1">
                                <div><strong>From Hospital:</strong> {r.fromHospital ? r.fromHospital.name : 'N/A'}</div>
                                <div><strong>From Doctor:</strong> {r.fromDoctor ? (r.fromDoctor.name || r.fromDoctor) : 'N/A'}</div>
                              </div>
                            </div>
                            <div className="text-sm text-slate-400 font-medium">
                              {new Date(r.date || r.createdAt).toLocaleString('en-GB')}
                            </div>
                          </div>
                          <div className="text-slate-600 bg-slate-50/80 p-4 rounded-lg text-sm border border-slate-200/60 font-medium">
                            {r.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
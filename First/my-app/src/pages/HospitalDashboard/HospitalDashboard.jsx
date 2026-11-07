import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { get, post, apiFetch } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const STATUSES = ['Admitted', 'Under Treatment', 'Under Observation', 'Referred', 'Discharged'];
const SPECIALIZATIONS = ['General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Gynecologist', 'Oncologist', 'Emergency Medicine'];
const statusClasses = {
  Admitted: 'bg-emerald-100 text-emerald-700',
  'Under Treatment': 'bg-blue-100 text-blue-700',
  'Under Observation': 'bg-amber-100 text-amber-700',
  Referred: 'bg-purple-100 text-purple-700',
  Discharged: 'bg-slate-100 text-slate-700',
};

const Badge = ({ children }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses[children] || 'bg-slate-100 text-slate-700'}`}>
    {children}
  </span>
);

const StatCard = ({ title, value, description, color = 'blue' }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200/60">
    <div className={`text-xs font-bold tracking-wider ${color === 'amber' ? 'text-amber-600' : color === 'green' ? 'text-emerald-600' : 'text-indigo-600'}`}>{title}</div>
    <div className="text-3xl font-bold text-slate-800 mt-2">{value}</div>
    <div className="text-xs text-slate-400 mt-1">{description}</div>
  </div>
);

const emptyForm = { name: '', email: '', phone: '', age: '', dateOfBirth: '', gender: '', address: '', bloodGroup: '', medicalHistory: '' };
const emptyDoctorForm = { name: '', email: '', phone: '', specialization: '', customSpecialization: '', scheduleDay: 'Monday', scheduleStart: '09:00', scheduleEnd: '17:00' };
const emptyOverview = { admittedTreatment: [], referredTo: [], referredBy: [] };

const HospitalDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [hospital, setHospital] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [overview, setOverview] = useState(emptyOverview);
  const [patientStats, setPatientStats] = useState({ total: 0, byStatus: {} });
  const [referrals, setReferrals] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [toHospitalId, setToHospitalId] = useState('');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('incoming');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [credentials, setCredentials] = useState(null);
  const [doctorCredentials, setDoctorCredentials] = useState(null);
  const [showDoctorRegistration, setShowDoctorRegistration] = useState(false);
  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  const loadPatients = useCallback(async () => {
    const query = new URLSearchParams();
    if (statusFilter) query.set('status', statusFilter);
    const [list, stats, hospitalOverview, hospitalDoctors] = await Promise.all([
      get(`/api/patients/hospital${query.toString() ? `?${query}` : ''}`),
      get('/api/patients/hospital/stats'),
      get('/api/patients/hospital/overview'),
      get('/api/doctors/hospital'),
    ]);
    setPatients(list || []);
    setPatientStats(stats || { total: 0, byStatus: {} });
    setOverview(hospitalOverview || emptyOverview);
    setDoctors(hospitalDoctors || []);
  }, [statusFilter]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      get('/api/hospitals'),
      get('/api/referrals/mine'),
    ]).then(([allHospitals, hospitalReferrals]) => {
      const selfId = hospital?.id || hospital?._id;
      setHospitals((allHospitals || []).filter((item) => !(selfId && (item._id === selfId || item.id === selfId))));
      setReferrals(hospitalReferrals || []);
    }).catch((err) => alert(`Unable to load dashboard: ${err.message}`));
    loadPatients().catch((err) => alert(`Unable to load patients: ${err.message}`));
  }, [token, hospital, loadPatients]);

  const login = async () => {
    try {
      const json = await post('/api/hospitals/login', { email, password });
      setToken(json.token);
      setHospital(json.hospital);
      localStorage.setItem('token', json.token);
      localStorage.setItem('role', 'hospital');
      localStorage.setItem('user', JSON.stringify(json.hospital));
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  const logout = () => {
    ['token', 'user', 'role'].forEach((key) => localStorage.removeItem(key));
    setToken('');
    setHospital(null);
    navigate('/register');
  };

  const registerPatient = async (event) => {
    event.preventDefault();
    try {
      const result = await post('/api/patients/hospital', form);
      setCredentials({ name: result.patient.name, identifier: result.patient.email || result.patient.phone, password: result.temporaryPassword });
      setForm(emptyForm);
      await loadPatients();
    } catch (err) {
      alert(`Patient registration failed: ${err.message}`);
    }
  };

  const updateStatus = async (patientId, status) => {
    try {
      const updated = await apiFetch(`/api/patients/hospital/${patientId}/status`, { method: 'PATCH', body: { status } });
      setPatients((current) => current.map((patient) => patient._id === updated._id ? updated : patient));
      setSelectedPatient((current) => current && current._id === updated._id ? updated : current);
      await loadPatients();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const assignDoctor = async (patientId, doctorId) => {
    try {
      const updated = await apiFetch(`/api/patients/hospital/${patientId}/doctor`, { method: 'PATCH', body: { doctorId: doctorId || null } });
      setSelectedPatient((current) => current && current._id === updated._id ? updated : current);
      await loadPatients();
    } catch (err) {
      alert(`Doctor assignment failed: ${err.message}`);
    }
  };

  const registerDoctor = async (event) => {
    event.preventDefault();
    try {
      const specialization = doctorForm.specialization === 'custom' ? doctorForm.customSpecialization : doctorForm.specialization;
      const result = await post('/api/doctors/hospital', { ...doctorForm, specialization, schedule: [{ day: doctorForm.scheduleDay, startTime: doctorForm.scheduleStart, endTime: doctorForm.scheduleEnd }] });
      setDoctorCredentials({ ...result.doctor, password: result.temporaryPassword });
      setDoctorForm(emptyDoctorForm);
      await loadPatients();
    } catch (err) {
      alert(`Doctor registration failed: ${err.message}`);
    }
  };

  const openPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      setDetail(await get(`/api/patients/hospital/${patient._id}`));
    } catch (err) {
      alert(`Unable to load patient profile: ${err.message}`);
    }
  };

  const createReferral = async () => {
    if (!selectedPatientId || !toHospitalId) return alert('Select patient and destination hospital');
    try {
      await post('/api/referrals/hospital', { patient: selectedPatientId, toHospitalId, reason: notes || 'Referral from hospital dashboard' });
      setReferrals(await get('/api/referrals/mine'));
      await loadPatients();
      setSelectedPatientId('');
      setToHospitalId('');
      setNotes('');
      alert('Referral created successfully');
    } catch (err) {
      alert(`Create error: ${err.message}`);
    }
  };

  const actOnReferral = async (id, action) => {
    try {
      const result = await post(`/api/referrals/${id}/action`, { action, message: action === 'accept' ? 'Accepted' : 'Rejected' });
      setReferrals((current) => current.map((referral) => referral._id === id ? result.referral : referral));
      await loadPatients();
    } catch (err) {
      alert(`Action error: ${err.message}`);
    }
  };

  const visibleOverview = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return overview;
    const matches = (item) => {
      const patient = item.patient || item;
      return [patient?.name, patient?._id, patient?.email, patient?.phone].some((field) => String(field || '').toLowerCase().includes(value));
    };
    return {
      admittedTreatment: overview.admittedTreatment.filter(matches),
      referredTo: overview.referredTo.filter(matches),
      referredBy: overview.referredBy.filter(matches),
    };
  }, [overview, search]);

  const incoming = referrals.filter((referral) => referral.status === 'pending');
  const processed = referrals.filter((referral) => referral.status !== 'pending');

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200/60 w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Hospital Login</h1>
          <div className="space-y-4">
            <input className="w-full border rounded-xl p-3" placeholder="Hospital email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input className="w-full border rounded-xl p-3" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold" onClick={login}>Sign In to Hospital Portal</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 sm:p-6 font-sans">
      <div className="max-w-[1500px] mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div><h1 className="text-2xl font-bold text-indigo-600">Swastha Sampark</h1><p className="text-sm text-slate-500">Healthcare Connection Platform</p></div>
          <div className="flex items-center gap-3"><span className="text-sm text-slate-500 hidden sm:inline">{hospital?.name || 'Hospital'}</span><button onClick={logout} className="px-4 py-2 bg-white border rounded-xl text-sm">Logout</button></div>
        </header>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-4xl font-bold text-slate-800">Hospital Dashboard</h2><p className="text-slate-600 mt-1">Welcome back, {hospital?.name || 'Hospital'}</p></div>
          <button onClick={() => { setCredentials(null); setShowRegistration(true); }} className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold shadow-sm">+ Add New Patient</button>
          <button onClick={() => setShowDoctorRegistration(true)} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-sm">+ Add Doctor</button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <main className="min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <StatCard title="TOTAL REFERRALS" value={referrals.length} description="All referrals" />
              <StatCard title="PENDING" value={incoming.length} description="Awaiting action" color="amber" />
              <StatCard title="PROCESSED" value={processed.length} description="Completed cases" color="green" />
            </div>
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Refer a Patient</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <select className="border rounded-xl p-3" value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)}><option value="">Select patient</option>{patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name}</option>)}</select>
                <select className="border rounded-xl p-3" value={toHospitalId} onChange={(event) => setToHospitalId(event.target.value)}><option value="">Destination hospital</option>{hospitals.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
              </div>
              <textarea className="w-full border rounded-xl p-3 mt-4" rows="3" placeholder="Medical notes and reason" value={notes} onChange={(event) => setNotes(event.target.value)} />
              <button onClick={createReferral} className="mt-4 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold">Create Referral</button>
            </section>
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 mb-6">
              <div className="flex items-center justify-between mb-4"><div><h3 className="text-2xl font-bold text-slate-800">Hospital Doctors</h3><p className="text-sm text-slate-500">Doctors can sign in with their one-time credentials.</p></div><button onClick={() => setShowDoctorRegistration(true)} className="border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-semibold">Add Doctor</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{doctors.map((doctor) => <div key={doctor._id} className="border rounded-xl p-4"><div className="font-semibold text-slate-800">{doctor.name}</div><div className="text-sm text-indigo-600">{doctor.specialization}</div><div className="text-xs text-slate-500 mt-1">{doctor.email}</div></div>)}</div>
              {!doctors.length && <p className="text-sm text-slate-400">No doctors registered yet.</p>}
            </section>
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60">
              <div className="flex gap-5 border-b mb-5"><button className={`pb-3 font-semibold ${activeTab === 'incoming' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`} onClick={() => setActiveTab('incoming')}>Incoming ({incoming.length})</button><button className={`pb-3 font-semibold ${activeTab === 'processed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`} onClick={() => setActiveTab('processed')}>Processed ({processed.length})</button></div>
              {(activeTab === 'incoming' ? incoming : processed).map((referral) => <div key={referral._id} className="border rounded-xl p-4 mb-3"><div className="flex justify-between gap-3"><strong>{referral.patient?.name || 'Patient'}</strong><span className="text-sm text-slate-500">{referral.status}</span></div><p className="text-sm text-slate-600 mt-2">{referral.reason}</p>{activeTab === 'incoming' && <div className="flex gap-2 mt-4"><button onClick={() => actOnReferral(referral._id, 'accept')} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm">Accept</button><button onClick={() => actOnReferral(referral._id, 'reject')} className="bg-rose-600 text-white px-3 py-2 rounded-lg text-sm">Reject</button></div>}</div>)}
              {(activeTab === 'incoming' ? incoming : processed).length === 0 && <p className="text-center text-slate-400 py-10">No referrals in this section.</p>}
            </section>
          </main>
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} xl:block bg-white rounded-2xl shadow-sm border border-slate-200/60 xl:sticky xl:top-6 overflow-hidden`}>
            <div className="p-5 border-b"><div className="flex justify-between items-center"><div><h3 className="text-xl font-bold text-slate-800">Patient Overview</h3><p className="text-sm text-slate-500 mt-1">{patientStats.total} total patients</p></div><button className="xl:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>Close</button></div><div className="flex gap-2 mt-4"><input className="min-w-0 flex-1 border rounded-xl p-2.5 text-sm" placeholder="Search name or ID" value={search} onChange={(event) => setSearch(event.target.value)} /><select className="border rounded-xl p-2 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div></div>
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto p-4">
              <div className="mb-5">
                <h4 className="text-sm font-bold text-emerald-700 mb-3">Admitted & Treatment Going ({visibleOverview.admittedTreatment.length})</h4>
                {visibleOverview.admittedTreatment.map((patient) => <button key={patient._id} onClick={() => openPatient(patient)} className="w-full text-left border rounded-xl p-3 mb-3 hover:border-indigo-300 hover:shadow-sm">
                  <div className="flex justify-between gap-2"><strong className="text-slate-800 truncate">{patient.name}</strong><Badge>{patient.status}</Badge></div>
                  <p className="text-xs text-slate-500 mt-2">ID: {patient._id}</p>
                  <p className="text-xs text-slate-600 mt-1">{patient.age || 'Age not set'} / {patient.gender || 'Gender not set'}</p>
                  <p className="text-xs text-slate-500 mt-1">In-charge: {patient.assignedDoctor?.name || 'Unassigned'}</p>
                </button>)}
                {!visibleOverview.admittedTreatment.length && <p className="text-xs text-slate-400">No admitted or treatment patients.</p>}
              </div>
              <div className="border-t pt-4 mb-5">
                <h4 className="text-sm font-bold text-purple-700 mb-3">Referred To This Hospital ({visibleOverview.referredTo.length})</h4>
                {visibleOverview.referredTo.map((referral) => <div key={referral._id} className="w-full text-left border rounded-xl p-3 mb-3">
                  <div className="flex justify-between gap-2"><strong className="text-slate-800 truncate">{referral.patient?.name || 'Patient'}</strong><Badge>{referral.status}</Badge></div>
                  <p className="text-xs text-slate-500 mt-2">From: {referral.fromHospital?.name || 'Unknown hospital'}</p>
                  <p className="text-xs text-slate-600 mt-1">Reason: {referral.reason || 'Not recorded'}</p>
                </div>)}
                {!visibleOverview.referredTo.length && <p className="text-xs text-slate-400">No incoming referrals.</p>}
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-blue-700 mb-3">Referred By This Hospital ({visibleOverview.referredBy.length})</h4>
                {visibleOverview.referredBy.map((referral) => <div key={referral._id} className="w-full text-left border rounded-xl p-3 mb-3">
                  <div className="flex justify-between gap-2"><strong className="text-slate-800 truncate">{referral.patient?.name || 'Patient'}</strong><Badge>{referral.status}</Badge></div>
                  <p className="text-xs text-slate-500 mt-2">To: {referral.toHospital?.name || 'Unknown hospital'}</p>
                  <p className="text-xs text-slate-600 mt-1">Reason: {referral.reason || 'Not recorded'}</p>
                </div>)}
                {!visibleOverview.referredBy.length && <p className="text-xs text-slate-400">No outgoing referrals.</p>}
              </div>
            </div>
          </aside>
        </div>
        <button className="xl:hidden fixed bottom-5 right-5 bg-indigo-600 text-white rounded-full px-5 py-3 shadow-lg" onClick={() => setSidebarOpen(true)}>Patient Overview</button>
      </div>

      {showRegistration && <div className="fixed inset-0 z-30 bg-slate-900/40 p-4 overflow-y-auto"><div className="bg-white rounded-2xl max-w-3xl mx-auto p-6 my-8"><div className="flex justify-between items-center mb-5"><h3 className="text-2xl font-bold text-slate-800">Register New Patient</h3><button onClick={() => setShowRegistration(false)} className="text-slate-500">✕</button></div><form onSubmit={registerPatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">{[['name', 'Full Name *'], ['email', 'Email (optional)'], ['phone', 'Phone Number'], ['age', 'Age'], ['dateOfBirth', 'Date of Birth'], ['gender', 'Gender'], ['address', 'Address'], ['bloodGroup', 'Blood Group']].map(([key, label]) => <label key={key} className="text-sm text-slate-700">{label}<input required={key === 'name'} type={key === 'dateOfBirth' ? 'date' : key === 'age' ? 'number' : 'text'} className="w-full border rounded-xl p-2.5 mt-1" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}<label className="md:col-span-2 text-sm text-slate-700">Medical History<textarea className="w-full border rounded-xl p-2.5 mt-1" rows="3" value={form.medicalHistory} onChange={(event) => setForm({ ...form, medicalHistory: event.target.value })} /></label><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setShowRegistration(false)} className="px-4 py-2 border rounded-xl">Cancel</button><button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Register Patient</button></div></form></div></div>}
      {credentials && <div className="fixed inset-0 z-40 bg-slate-900/40 flex items-center justify-center p-4"><div className="bg-white rounded-2xl p-6 max-w-md w-full"><h3 className="text-xl font-bold text-slate-800">Patient registered</h3><p className="text-sm text-slate-600 mt-2">Show these temporary credentials to the patient now. They will be required to change the password after first login.</p><div className="bg-slate-50 rounded-xl p-4 mt-4 text-sm"><p><strong>Patient:</strong> {credentials.name}</p><p><strong>Login:</strong> {credentials.identifier}</p><p><strong>Temporary password:</strong> {credentials.password}</p></div><button onClick={() => { setCredentials(null); setShowRegistration(false); }} className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-semibold">Done</button></div></div>}
      {selectedPatient && <div className="fixed inset-0 z-30 bg-slate-900/40 flex items-center justify-center p-4" onClick={() => { setSelectedPatient(null); setDetail(null); }}><div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}><div className="flex justify-between"><div><h3 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h3><p className="text-sm text-slate-500">Patient ID: {selectedPatient._id}</p></div><button onClick={() => { setSelectedPatient(null); setDetail(null); }}>✕</button></div>      <div className="mt-4"><Badge>{selectedPatient.status}</Badge><p className="text-sm text-slate-600 mt-3">{selectedPatient.age || 'Age not set'} / {selectedPatient.gender || 'Gender not set'} · {selectedPatient.phone || selectedPatient.email || 'No contact'}</p><label className="block text-sm font-medium mt-5">Update status<select className="w-full border rounded-xl p-2.5 mt-1" value={selectedPatient.status} onChange={(event) => updateStatus(selectedPatient._id, event.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label className="block text-sm font-medium mt-4">Assigned doctor<select className="w-full border rounded-xl p-2.5 mt-1" value={selectedPatient.assignedDoctor?._id || selectedPatient.assignedDoctor || ''} onChange={(event) => assignDoctor(selectedPatient._id, event.target.value)}><option value="">Unassigned</option>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} · {doctor.specialization}</option>)}</select></label><p className="text-sm font-semibold text-slate-700 mt-5">Referral history</p>{(detail?.referrals || []).map((referral) => <p key={referral._id} className="text-sm text-slate-600 border-b py-2">{referral.status}: {referral.reason || 'No reason'}</p>)}{detail && !detail.referrals?.length && <p className="text-sm text-slate-400 mt-2">No referral history.</p>}</div></div></div>}
      {showDoctorRegistration && <div className="fixed inset-0 z-30 bg-slate-900/40 p-4 overflow-y-auto"><div className="bg-white rounded-2xl max-w-2xl mx-auto p-6 my-8"><div className="flex justify-between items-center mb-5"><h3 className="text-2xl font-bold text-slate-800">Add Doctor</h3><button onClick={() => setShowDoctorRegistration(false)} className="text-slate-500">✕</button></div><form onSubmit={registerDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4"><label className="text-sm text-slate-700">Full name *<input required className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.name} onChange={(event) => setDoctorForm({ ...doctorForm, name: event.target.value })} /></label><label className="text-sm text-slate-700">Email *<input required type="email" className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.email} onChange={(event) => setDoctorForm({ ...doctorForm, email: event.target.value })} /></label><label className="text-sm text-slate-700">Phone<input className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.phone} onChange={(event) => setDoctorForm({ ...doctorForm, phone: event.target.value })} /></label><label className="text-sm text-slate-700">Speciality *<select required className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.specialization} onChange={(event) => setDoctorForm({ ...doctorForm, specialization: event.target.value })}><option value="">Select speciality</option>{SPECIALIZATIONS.map((speciality) => <option key={speciality}>{speciality}</option>)}<option value="custom">Custom speciality</option></select></label>{doctorForm.specialization === 'custom' && <label className="md:col-span-2 text-sm text-slate-700">Custom speciality *<input required className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.customSpecialization} onChange={(event) => setDoctorForm({ ...doctorForm, customSpecialization: event.target.value })} /></label>}<label className="text-sm text-slate-700">Schedule day<select className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.scheduleDay} onChange={(event) => setDoctorForm({ ...doctorForm, scheduleDay: event.target.value })}>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <option key={day}>{day}</option>)}</select></label><label className="text-sm text-slate-700">Start time<input type="time" className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.scheduleStart} onChange={(event) => setDoctorForm({ ...doctorForm, scheduleStart: event.target.value })} /></label><label className="text-sm text-slate-700">End time<input type="time" className="w-full border rounded-xl p-2.5 mt-1" value={doctorForm.scheduleEnd} onChange={(event) => setDoctorForm({ ...doctorForm, scheduleEnd: event.target.value })} /></label><div className="md:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setShowDoctorRegistration(false)} className="px-4 py-2 border rounded-xl">Cancel</button><button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold">Create Doctor</button></div></form></div></div>}
      {doctorCredentials && <div className="fixed inset-0 z-40 bg-slate-900/40 flex items-center justify-center p-4"><div className="bg-white rounded-2xl p-6 max-w-md w-full"><h3 className="text-xl font-bold text-slate-800">Doctor created</h3><p className="text-sm text-slate-600 mt-2">Share these credentials once. The doctor must change the temporary password after signing in.</p><div className="bg-slate-50 rounded-xl p-4 mt-4 text-sm"><p><strong>Doctor:</strong> {doctorCredentials.name}</p><p><strong>Speciality:</strong> {doctorCredentials.specialization}</p><p><strong>Login:</strong> {doctorCredentials.email}</p><p><strong>Temporary password:</strong> {doctorCredentials.password}</p></div><button onClick={() => { setDoctorCredentials(null); setShowDoctorRegistration(false); }} className="w-full mt-5 bg-emerald-600 text-white py-3 rounded-xl font-semibold">Done</button></div></div>}
    </div>
  );
};

export default HospitalDashboard;

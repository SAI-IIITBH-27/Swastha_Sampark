import React, { useEffect, useMemo, useState } from 'react';
import { get, post } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  admitted: 'bg-emerald-100 text-emerald-700',
  'under treatment': 'bg-blue-100 text-blue-700',
  'under observation': 'bg-amber-100 text-amber-700',
  discharged: 'bg-slate-100 text-slate-700',
  referred: 'bg-purple-100 text-purple-700',
};

const StatusBadge = ({ status }) => {
  const value = status || 'Unknown';
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[value.toLowerCase()] || 'bg-slate-100 text-slate-700'}`}>{value}</span>;
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const stored = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);
  const patientId = stored?._id || stored?.id;
  const [patient, setPatient] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(Boolean(stored?.mustChangePassword));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('role') !== 'patient' || !patientId) {
      navigate('/register');
      return;
    }
    setLoading(true);
    Promise.all([
      get(`/api/patients/${patientId}`),
      get(`/api/referrals/patient/${patientId}`),
    ]).then(([profile, patientReferrals]) => {
      setPatient(profile);
      setReferrals(patientReferrals || []);
      }).catch((error) => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        alert(`Unable to load your patient records: ${error.message}`);
        navigate('/register');
      })
      .finally(() => setLoading(false));
  }, [navigate, patientId]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/register');
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await post('/api/patients/change-password', { currentPassword, newPassword });
      const updated = { ...patient, mustChangePassword: false };
      setPatient(updated);
      setMustChangePassword(false);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (error) {
      alert(`Password change failed: ${error.message}`);
    }
  };

  const referralCount = referrals.length;
  const activeReferralCount = referrals.filter((referral) => !['rejected', 'discharged', 'completed', 'cancelled'].includes(referral.status)).length;
  const hospitalHistory = useMemo(() => {
    const hospitals = new Map();
    referrals.forEach((referral) => {
      [referral.fromHospital, referral.toHospital].forEach((hospital) => {
        if (hospital?._id && !hospitals.has(String(hospital._id))) hospitals.set(String(hospital._id), hospital);
      });
    });
    return Array.from(hospitals.values());
  }, [referrals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">Swastha Sampark</h1>
            <p className="text-sm text-slate-500">Your healthcare portal</p>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium">Logout</button>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-800">My Health</h2>
            <p className="text-slate-600 mt-1">Welcome, {patient?.name || 'Patient'}</p>
          </div>
          {patient?.status && <StatusBadge status={patient.status} />}
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
              {(patient?.name || 'P').slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-800">{patient?.name || 'Patient'}</h3>
              <p className="text-sm text-slate-500 mt-1">{patient?.email || patient?.phone || 'No contact information'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-sm">
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Patient ID:</span> {patient?._id || '—'}</div>
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Age / Gender:</span> {patient?.age || '—'} / {patient?.gender || '—'}</div>
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Blood group:</span> {patient?.bloodGroup || '—'}</div>
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Hospital:</span> {patient?.hospital?.name || 'Not assigned'}</div>
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Referred to:</span> {patient?.referredTo?.name || '—'}</div>
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Doctor:</span> {patient?.assignedDoctor?.name || 'Not assigned'}</div>
                <div className="bg-slate-50 border rounded-lg p-3"><span className="text-slate-400">Status:</span> {patient?.status || '—'}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border p-5"><p className="text-sm text-slate-500">Current status</p><p className="text-2xl font-bold text-slate-800 mt-2">{patient?.status || 'Not recorded'}</p></div>
          <div className="bg-white rounded-2xl border p-5"><p className="text-sm text-slate-500">Total referrals</p><p className="text-2xl font-bold text-slate-800 mt-2">{referralCount}</p></div>
          <div className="bg-white rounded-2xl border p-5"><p className="text-sm text-slate-500">Active referrals</p><p className="text-2xl font-bold text-slate-800 mt-2">{activeReferralCount}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl border p-5">
            <h3 className="text-xl font-bold text-slate-800">My Referrals</h3>
            <p className="text-sm text-slate-500 mt-1">Track where your referral is and what happens next.</p>
            {loading && <p className="text-slate-400 py-8">Loading referrals...</p>}
            {!loading && referrals.length === 0 && <p className="text-slate-400 py-8">No referrals have been recorded.</p>}
            <div className="space-y-4 mt-4">
              {referrals.map((referral) => <article key={referral._id} className="border rounded-xl p-4">
                <div className="flex justify-between gap-3">
                  <div><p className="font-semibold text-slate-800">{referral.fromHospital?.name || 'Referring hospital'} → {referral.toHospital?.name || 'Receiving hospital'}</p><p className="text-xs text-slate-500 mt-1">{new Date(referral.date || referral.createdAt).toLocaleString('en-GB')}</p></div>
                  <StatusBadge status={referral.status} />
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mt-3">{referral.reason || 'No reason recorded'}</p>
                <div className="flex flex-wrap gap-2 text-xs mt-3 text-slate-500"><span className="text-indigo-600 font-semibold">Initiated</span><span>→</span><span className={referral.status === 'accepted' ? 'text-indigo-600 font-semibold' : ''}>Hospital review</span><span>→</span><span className={['accepted', 'admitted', 'under_treatment'].includes(referral.status) ? 'text-indigo-600 font-semibold' : ''}>Treatment</span><span>→</span><span className={referral.status === 'discharged' ? 'text-indigo-600 font-semibold' : ''}>Discharged</span></div>
              </article>)}
            </div>
          </section>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl border p-5">
              <h3 className="text-xl font-bold text-slate-800">Medical History</h3>
              {patient?.medicalHistory?.length ? <ul className="list-disc list-inside text-slate-600 text-sm mt-3 space-y-2">{patient.medicalHistory.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p className="text-slate-400 text-sm mt-3">No medical history recorded.</p>}
            </section>
            <section className="bg-white rounded-2xl border p-5">
              <h3 className="text-xl font-bold text-slate-800">Hospital Care History</h3>
              <p className="text-sm text-slate-500 mt-1">Hospitals involved in your referral journey.</p>
              {hospitalHistory.length ? <div className="mt-3 space-y-2">{hospitalHistory.map((hospital) => <div key={hospital._id} className="flex items-center justify-between bg-slate-50 border rounded-lg p-3 text-sm"><span className="font-medium text-slate-700">{hospital.name}</span><span className="text-slate-400">{hospital._id === patient?.hospital?._id ? 'Current hospital' : 'Referral hospital'}</span></div>)}</div> : <p className="text-slate-400 text-sm mt-3">No previous referral hospitals recorded.</p>}
            </section>
            <section className="bg-white rounded-2xl border p-5">
              <h3 className="text-xl font-bold text-slate-800">Reports</h3>
              <p className="text-sm text-slate-500 mt-2">Uploaded lab reports and scans will appear here when available.</p>
              <p className="text-sm text-slate-400 mt-3">No reports available.</p>
            </section>
            <section className="bg-white rounded-2xl border p-5">
              <h3 className="text-xl font-bold text-slate-800">What to do</h3>
              <ul className="text-sm text-slate-600 mt-3 space-y-2 list-disc list-inside"><li>Follow instructions from your treating doctor.</li><li>Keep referral and hospital details available.</li><li>Attend scheduled follow-up visits.</li><li>Ask hospital staff before changing medication.</li></ul>
            </section>
            <section className="bg-white rounded-2xl border p-5">
              <h3 className="text-xl font-bold text-slate-800">Basic first aid</h3>
              <p className="text-sm text-slate-600 mt-2">For severe bleeding, breathing difficulty, chest pain, stroke symptoms, or unconsciousness, call emergency services immediately. Do not delay urgent medical care.</p>
            </section>
          </div></div>
        </div>
      {mustChangePassword && <div className="fixed inset-0 z-30 bg-slate-900/40 flex items-center justify-center p-4"><form onSubmit={changePassword} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"><h3 className="text-xl font-bold text-slate-800">Change your temporary password</h3><p className="text-sm text-slate-600 mt-2">Choose a permanent password before continuing.</p><input className="w-full border rounded-xl p-3 mt-4" type="password" required placeholder="Temporary password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /><input className="w-full border rounded-xl p-3 mt-3" type="password" minLength="8" required placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><button className="w-full bg-indigo-600 text-white rounded-xl py-3 mt-4 font-semibold" type="submit">Save new password</button></form></div>}
      </div>
  );
};

export default PatientDashboard;

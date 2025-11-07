import React, { useEffect, useMemo, useState } from 'react';
import { get } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className={`p-4 rounded-xl border-2 ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500 mb-1 tracking-wide">{title}</div>
        <div className="text-3xl font-bold text-gray-800 font-sans">{value}</div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const stored = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);

  const doctorId = stored && (stored._id || stored.id);
  const [doctor, setDoctor] = useState(stored || null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/register');
  };

  useEffect(() => {
    if (!doctorId) return;
    get(`/api/doctors/${doctorId}`).then(d => setDoctor(d)).catch(() => {});
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    get(`/api/referrals/doctor/${doctorId}`).then(data => setReferrals(data || [])).catch(() => setReferrals([])).finally(() => setLoading(false));
  }, [doctorId]);

  const stats = useMemo(() => {
    const total = referrals.length;
    const accepted = referrals.filter(r => r.status === 'accepted').length;
    const rejected = referrals.filter(r => r.status === 'rejected').length;
    const pending = referrals.filter(r => r.status === 'pending').length;
    return { total, accepted, rejected, pending };
  }, [referrals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
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
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-xs border border-slate-200/60 font-medium">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-2 font-sans tracking-tight">Doctor Dashboard</h2>
            <p className="text-slate-600 text-lg font-light">Welcome back, Dr. {doctor?.name?.split(' ')[0] || 'Doctor'}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Doctor Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 sticky top-6 backdrop-blur-sm bg-white/95">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <img 
                    src={doctor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name||'Doctor')}&size=128&background=4f46e5&color=ffffff&bold=true&font-size=0.8`} 
                    alt="avatar" 
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-3 border-white shadow-sm"></div>
                </div>
                <div className="font-bold text-2xl text-slate-800 mb-1 font-sans">{doctor?.name || 'Dr. Alice'}</div>
                <div className="text-indigo-600 font-semibold mb-3 bg-indigo-50 px-4 py-1.5 rounded-full text-sm border border-indigo-100 tracking-wide">
                  {doctor?.specialization || 'General Practitioner'}
                </div>
                <div className="text-slate-500 text-sm mb-5 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {doctor?.email || 'alice@doctor.test'}
                </div>
                
                <div className="w-full border-t border-slate-200 pt-5 mt-2">
                  <div className="text-sm font-semibold text-slate-700 mb-3 tracking-wide flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5m0 5h4"/>
                    </svg>
                    HOSPITAL AFFILIATION
                  </div>
                  <div className="text-slate-600 bg-slate-50 px-4 py-3 rounded-xl text-sm border border-slate-200 font-medium">
                    {doctor?.hospital?.name || doctor?.hospital || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="TOTAL REFERRALS" 
                value={stats.total} 
                color="blue"
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-6a2 2 0 012-2h6"/>
                  </svg>
                } 
              />
              <StatCard 
                title="ACCEPTED" 
                value={stats.accepted} 
                color="green"
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/>
                  </svg>
                } 
              />
              <StatCard 
                title="PENDING" 
                value={stats.pending} 
                color="amber"
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3"/>
                  </svg>
                } 
              />
            </div>

            {/* Recent Referrals Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-8 border border-slate-200/60">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 font-sans tracking-tight">Recent Referrals</h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Manage and review patient referrals</p>
                </div>
                <div className="text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 tracking-wide">
                  {loading ? 'Loading...' : `${stats.total} total referrals`}
                </div>
              </div>

              {referrals.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="text-slate-300 text-7xl mb-6">📋</div>
                  <div className="text-slate-400 text-lg font-medium mb-2">No referrals yet</div>
                  <div className="text-slate-300 text-sm">Patient referrals will appear here once assigned</div>
                </div>
              )}

              <div className="space-y-4">
                {referrals.map(r => (
                  <div key={r._id} className="flex items-start gap-5 p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-indigo-200/60 bg-white/50">
                    <div className="flex-shrink-0">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.patient?.name||'Patient')}&background=4f46e5&color=ffffff&bold=true&font-size=0.7`} 
                        alt="patient" 
                        className="w-14 h-14 rounded-xl border-2 border-white shadow-sm" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                        <div>
                          <div className="font-bold text-slate-800 text-lg font-sans">{r.patient?.name || 'Patient One'}</div>
                          <div className="text-sm text-slate-500 mt-1 font-medium">
                            Referred to: <span className="text-slate-700">{r.toHospital?.name || (r.toHospital || 'Apollo Hospital')}</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 mt-2 lg:mt-0 font-medium">
                          {new Date(r.date || r.createdAt).toLocaleString('en-GB')}
                        </div>
                      </div>
                      <div className="text-slate-600 bg-slate-50/80 p-4 rounded-lg text-sm my-3 border border-slate-200/60 font-medium">
                        {r.reason || "Patient requires specialized care and further evaluation"}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className={`px-3 py-1.5 rounded-full font-semibold tracking-wide text-xs border ${
                          r.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          r.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {r.status?.charAt(0).toUpperCase() + r.status?.slice(1) || 'Accepted'}
                        </span>
                        <span className="text-slate-500 font-medium">
                          From: <span className="text-slate-700">{r.fromHospital?.name || (r.fromHospital || 'CityCare Hospital')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
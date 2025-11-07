import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { MapPin, Search, Stethoscope, X, AlertTriangle, Clock, Users, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { get, post } from '../../services/apiClient';

const EmergencyReferral = () => {
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [referralNotes, setReferralNotes] = useState('');
  const [referralStats, setReferralStats] = useState({});
  const [patients, setPatients] = useState([]);
  const [creatingNewPatient, setCreatingNewPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [creatingPatientLoading, setCreatingPatientLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const loadedPatientsDoctorsRef = useRef(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedFromDoctorId, setSelectedFromDoctorId] = useState('');
  const [selectedFromHospitalId, setSelectedFromHospitalId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await get('/api/hospitals');
        setHospitals(data.map((h) => ({ ...h, id: h._id || h.id, _id: h._id || h.id })));

        try {
          const sdata = await get('/api/referrals/stats');
          const map = {};
          sdata.forEach((it) => { map[it.hospital.id] = it.count; });
          setReferralStats(map);
        } catch { /* ignore stats fetch errors */ }

        if (!loadedPatientsDoctorsRef.current) {
          try {
            const [pres, dres] = await Promise.all([
              get('/api/patients'),
              get('/api/doctors'),
            ]);
            if (pres) setPatients(pres);
            if (dres) setDoctors(dres);
          } catch { /* ignore patients/doctors fetch errors */ }
          loadedPatientsDoctorsRef.current = true;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();

    const interval = setInterval(() => {
      fetchHospitals();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filtered = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.specialty.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (hospital) => {
    setSelectedHospital(hospital);
    setReferralNotes('');
    setSelectedPatientId('');
    setSelectedFromDoctorId('');
    setSelectedFromHospitalId('');
    setIsOpen(true);
  };

  const sendReferral = async () => {
    if (!selectedHospital) return;
    if (!selectedPatientId) { alert('Please select a patient'); return; }
    try {
      const body = {
        patient: selectedPatientId,
        fromDoctor: selectedFromDoctorId || null,
        fromHospital: selectedFromHospitalId || null,
        toDoctor: null,
        toHospitalId: selectedHospital._id || selectedHospital.id,
        reason: referralNotes || 'Emergency referral from dashboard',
      };

      await post('/api/referrals', body);
      setReferralStats(prev => ({ ...prev, [selectedHospital._id]: (prev[selectedHospital._id] || 0) + 1 }));
      setIsOpen(false);
      alert('Referral sent successfully');
    } catch (err) {
      alert('Error sending referral: ' + err.message);
    }
  };

  const createPatient = async () => {
    if (!newPatientName) { alert('Please enter patient name'); return; }
    setCreatingPatientLoading(true);
    try {
      const created = await post('/api/patients/register', { name: newPatientName, email: newPatientEmail });
      setPatients(prev => [created, ...prev]);
      setSelectedPatientId(created._id || created.id);
      setCreatingNewPatient(false);
      setNewPatientName('');
      setNewPatientEmail('');
      alert('Patient created and selected');
    } catch (err) {
      alert('Error creating patient: ' + err.message);
    } finally {
      setCreatingPatientLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 font-medium">Loading emergency hospitals...</p>
          <p className="text-sm text-slate-400 mt-2">Preparing emergency referral system</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 font-sans flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-sm p-8 max-w-md border border-slate-200/60">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 font-sans">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight">Swastha Sampark</h1>
                  <p className="text-sm text-slate-500 font-medium">Emergency Response System</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => alert("Severity Detection coming soon!")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                <Activity className="w-4 h-4" />
                Severity Detection
              </button>
              <button
                onClick={() => alert("Report Analysis coming soon!")}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                <Clock className="w-4 h-4" />
                Report Analysis
              </button>
              <button
                onClick={() => alert("Consultancy Bot coming soon!")}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                <Users className="w-4 h-4" />
                Consultancy Bot
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Emergency Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-red-100 border border-red-200 px-6 py-3 rounded-full mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span className="text-red-700 font-semibold text-lg">🚨 EMERGENCY REFERRAL DASHBOARD</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4 font-sans tracking-tight">
            Critical Care Network
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Quickly locate and refer patients to specialized hospitals with real-time availability tracking
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-4 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="w-full p-4 pl-14 rounded-2xl shadow-sm border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
              placeholder="Search hospitals by name, specialty, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">{hospitals.length}</div>
            <div className="text-sm text-slate-500 font-medium">Total Hospitals</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">{hospitals.filter(h => h.status === "Available").length}</div>
            <div className="text-sm text-slate-500 font-medium">Available Now</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">{Object.values(referralStats).reduce((a, b) => a + b, 0)}</div>
            <div className="text-sm text-slate-500 font-medium">Total Referrals</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200/60 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">{patients.length}</div>
            <div className="text-sm text-slate-500 font-medium">Patients</div>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.length > 0 ? (
            filtered.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-red-200/60 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                    {hospital.name}
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hospital.status === "Available"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}>
                    {hospital.status}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <p className="flex items-center text-slate-600 text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    {hospital.location}
                  </p>
                  <p className="flex items-center text-slate-600 text-sm">
                    <Stethoscope className="w-4 h-4 mr-3 text-slate-400" />
                    {hospital.specialty}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>Referrals Today:</span>
                  <span className="font-semibold text-slate-700">{referralStats[hospital._id] || 0}</span>
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    hospital.status === "Available"
                      ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                  onClick={() => openModal(hospital)}
                  disabled={hospital.status !== "Available"}
                >
                  <AlertTriangle className="w-4 h-4" />
                  {hospital.status === "Available" ? "Emergency Referral" : "Unavailable"}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200/60">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium mb-2">No hospitals found</p>
              <p className="text-slate-400">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Referral Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-2xl w-full rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-slate-800">
                      Emergency Referral
                    </Dialog.Title>
                    <p className="text-slate-600 text-sm">
                      Referring to {selectedHospital?.name}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedHospital && (
                <>
                  {/* Hospital Info */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-2">Destination Hospital</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Name:</span>
                        <p className="font-medium">{selectedHospital.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Specialty:</span>
                        <p className="font-medium">{selectedHospital.specialty}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Location:</span>
                        <p className="font-medium">{selectedHospital.location}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedHospital.status === "Available" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {selectedHospital.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Patient Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Select Patient *</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    >
                      <option value="">-- Select existing patient --</option>
                      {patients.map((p) => (
                        <option key={p._id || p.id} value={p._id || p.id}>
                          {p.name} {p.email ? `(${p.email})` : ''}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCreatingNewPatient((s) => !s)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        {creatingNewPatient ? 'Cancel new patient' : '+ Create new patient'}
                      </button>
                      {creatingPatientLoading && (
                        <span className="text-sm text-slate-500">Creating patient...</span>
                      )}
                    </div>

                    {creatingNewPatient && (
                      <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-3">New Patient Details</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                            <input
                              value={newPatientName}
                              onChange={(e) => setNewPatientName(e.target.value)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="Enter patient full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                            <input
                              value={newPatientEmail}
                              onChange={(e) => setNewPatientEmail(e.target.value)}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              placeholder="patient@example.com"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={createPatient}
                              disabled={creatingPatientLoading}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Create Patient
                            </button>
                            <button
                              onClick={() => setCreatingNewPatient(false)}
                              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Referring Doctor (Optional)</label>
                      <select
                        value={selectedFromDoctorId}
                        onChange={(e) => setSelectedFromDoctorId(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      >
                        <option value="">-- Select doctor --</option>
                        {doctors.map((d) => (
                          <option key={d._id || d.id} value={d._id || d.id}>
                            {d.name} {d.email ? `(${d.email})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Referring Hospital (Optional)</label>
                      <select
                        value={selectedFromHospitalId}
                        onChange={(e) => setSelectedFromHospitalId(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      >
                        <option value="">-- Select hospital --</option>
                        {hospitals.map((h) => (
                          <option key={h._id || h.id} value={h._id || h.id}>
                            {h.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Medical Notes & Reason *</label>
                    <textarea
                      value={referralNotes}
                      onChange={(e) => setReferralNotes(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      rows={4}
                      placeholder="Enter detailed medical reason, symptoms, and urgency level..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={sendReferral}
                      disabled={!selectedPatientId}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Send Emergency Referral
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default EmergencyReferral;
import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { MapPin, Search, Stethoscope, X } from "lucide-react";
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
    // fetch hospitals + stats + patients/doctors (used on mount and for polling)
    const fetchHospitals = async () => {
      try {
        const data = await get('/api/hospitals');
        setHospitals(data.map((h) => ({ ...h, id: h._id || h.id, _id: h._id || h.id })));

        // referral stats
        try {
          const sdata = await get('/api/referrals/stats');
          const map = {};
          sdata.forEach((it) => { map[it.hospital.id] = it.count; });
          setReferralStats(map);
        } catch { /* ignore stats fetch errors */ }

        // only load patients/doctors once on first load to avoid excessive traffic
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

    // Poll hospitals and stats every 10 seconds so availability updates propagate to UI
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
        reason: referralNotes || 'Referral from app',
      };

      await post('/api/referrals', body);
      // optimistic update of stats
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
      // push into local patients list and select the new patient
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
      <div className="min-h-screen bg-gradient-to-tr from-white via-[#f3f4f6] to-[#e5e7eb] p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-white via-[#f3f4f6] to-[#e5e7eb] p-6 font-sans flex items-center justify-center">
        <div className="text-center bg-red-100 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-[#f3f4f6] to-[#e5e7eb] font-sans">
      {/* Top Menu Bar */}
      <div className="flex justify-between items-center p-4 bg-[#e0f2ff] shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="/SwasthaSamparkLogo.png"
            alt="Swasthya Sampark Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold text-blue-800">Swasthya Sampark</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => alert("Severity Detection coming soon!")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Severity Detection
          </button>
          <button
            onClick={() => alert("Report Analysis coming soon!")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Report Analysis
          </button>
          <button
            onClick={() => alert("Consultancy Bot coming soon!")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Consultancy Bot
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center text-[#1f2937] mt-8 mb-6">
        🚨 Emergency Referral Dashboard
      </h1>

      <div className="max-w-3xl mx-auto mb-6 px-4">
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 pl-12 rounded-2xl shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search hospitals, specialties, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-500" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {filtered.length > 0 ? (
          filtered.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {hospital.name}
              </h2>
              <p className="flex items-center text-gray-500 mt-2">
                <MapPin className="w-4 h-4 mr-2" /> {hospital.location}
              </p>
              <p className="flex items-center text-gray-600 mt-1">
                <Stethoscope className="w-4 h-4 mr-2" /> {hospital.specialty}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p
                  className={`inline-block px-3 py-1 text-sm rounded-full ${
                    hospital.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {hospital.status}
                </p>
                <p className="text-sm text-gray-500">Referrals: {referralStats[hospital._id] || 0}</p>
              </div>
              <button
                className="mt-4 w-full bg-red-600 text-white font-medium py-2 px-4 rounded-xl hover:bg-red-700 transition"
                onClick={() => openModal(hospital)}
                disabled={hospital.status !== "Available"}
              >
                Refer Now
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">
              No hospitals found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Referral Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md w-full rounded-xl p-6 shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
              Make Referral
            </Dialog.Title>
            {selectedHospital && (
              <>
                <p className="text-gray-600 mb-2">
                  Referring to <strong>{selectedHospital.name}</strong> for{" "}
                  <strong>{selectedHospital.specialty}</strong>.
                </p>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Patient ID / Notes
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-2">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg text-gray-700"
                >
                  <option value="">-- Select existing patient --</option>
                  {patients.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.name} {p.email ? `(${p.email})` : ''}</option>
                  ))}
                </select>

                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCreatingNewPatient((s) => !s)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {creatingNewPatient ? 'Cancel creating patient' : 'Create new patient'}
                  </button>
                  {creatingPatientLoading && <span className="text-sm text-gray-500">Creating...</span>}
                </div>

                {creatingNewPatient && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="Patient full name"
                    />
                    <label className="block text-sm font-medium text-gray-700 mt-2">Email (optional)</label>
                    <input
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="patient@example.com"
                    />
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={createPatient}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        disabled={creatingPatientLoading}
                      >
                        Create Patient
                      </button>
                      <button
                        onClick={() => setCreatingNewPatient(false)}
                        className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <label className="block text-sm font-medium text-gray-700 mt-3">Referring Doctor (optional)</label>
                <select
                  value={selectedFromDoctorId}
                  onChange={(e) => setSelectedFromDoctorId(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg text-gray-700"
                >
                  <option value="">-- Select doctor (optional) --</option>
                  {doctors.map((d) => (
                    <option key={d._id || d.id} value={d._id || d.id}>{d.name} {d.email ? `(${d.email})` : ''}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-3">Referring Hospital (optional)</label>
                <select
                  value={selectedFromHospitalId}
                  onChange={(e) => setSelectedFromHospitalId(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg text-gray-700"
                >
                  <option value="">-- Select hospital (optional) --</option>
                  {hospitals.map((h) => (
                    <option key={h._id || h.id} value={h._id || h.id}>{h.name}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mt-4">Notes</label>
                <textarea
                  value={referralNotes}
                  onChange={(e) => setReferralNotes(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Enter brief notes..."
                ></textarea>
                <button
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-full"
                  onClick={sendReferral}
                >
                  Confirm Referral
                </button>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default EmergencyReferral;

import React, { useEffect, useMemo, useState } from 'react';
import { get, post, patch } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const emptyAppointment = { patientId: '', date: '', time: '', notes: '' };
const emptyTreatment = { appointmentId: '', diagnosis: '', description: '', followUpDate: '' };
const emptyPrescription = { appointmentId: '', medicines: '', notes: '' };

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(emptyAppointment);
  const [treatment, setTreatment] = useState(emptyTreatment);
  const [prescription, setPrescription] = useState(emptyPrescription);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const loadWorkspace = async () => {
    try {
      setWorkspace(await get('/api/doctors/workspace'));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadWorkspace(); }, []);

  const stats = workspace?.statistics || {};
  const appointments = useMemo(() => workspace?.appointments || [], [workspace]);
  const patients = useMemo(() => workspace?.patients || [], [workspace]);
  const activeAppointments = useMemo(() => appointments.filter((item) => item.status === 'Scheduled'), [appointments]);

  const submit = async (event, endpoint, body, reset) => {
    event.preventDefault();
    setSaving(true);
    try {
      await post(endpoint, body);
      reset();
      await loadWorkspace();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await post('/api/doctors/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      await loadWorkspace();
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePatientStatus = async (patientId, status) => {
    try {
      await patch(`/api/doctors/patients/${patientId}/status`, { status });
      await loadWorkspace();
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    ['token', 'user', 'role'].forEach((key) => localStorage.removeItem(key));
    navigate('/register');
  };

  if (error && !workspace) return <div className="min-h-screen flex items-center justify-center p-6"><div className="bg-white rounded-2xl shadow p-6"><p className="text-rose-600">{error}</p><button onClick={logout} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">Return to login</button></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div><h1 className="text-2xl font-bold text-indigo-600">Swastha Sampark</h1><p className="text-slate-500">Doctor workspace</p></div>
          <button onClick={logout} className="px-4 py-2 bg-white border rounded-xl">Logout</button>
        </header>
        <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Dr. {workspace?.doctor?.name || 'Doctor'}</h2>
          <p className="text-indigo-600 font-semibold mt-1">{workspace?.doctor?.specialization || 'Speciality not set'}</p>
          <p className="text-sm text-slate-500 mt-1">{workspace?.doctor?.hospital?.name || 'Hospital'}</p>
        </section>
        {workspace?.doctor?.mustChangePassword && <form onSubmit={changePassword} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6"><h3 className="font-bold text-amber-900">Change your temporary password</h3><div className="grid sm:grid-cols-2 gap-3 mt-3"><input required type="password" placeholder="Temporary password" className="border rounded-xl p-2.5" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} /><input required minLength="8" type="password" placeholder="New password (8+ characters)" className="border rounded-xl p-2.5" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} /></div><button className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-xl">Update password</button></form>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[['Assigned patients', stats.totalPatients || 0], ['Active cases', stats.activeCases || 0], ['Today appointments', stats.todayAppointments || 0], ['Discharged', stats.completedCases || 0]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl shadow-sm border p-5"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-bold text-slate-800 mt-2">{value}</p></div>)}
        </div>
        <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Patient statistics</h3>
          <div className="space-y-3">{Object.entries(stats.statusCounts || {}).map(([status, count]) => <div key={status}><div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{status}</span><span className="font-semibold">{count}</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stats.totalPatients ? Math.round((count / stats.totalPatients) * 100) : 0}%` }} /></div></div>)}</div>
          {!Object.keys(stats.statusCounts || {}).length && <p className="text-sm text-slate-400">Statistics will appear when patients are assigned.</p>}
        </section>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Assigned patients</h3>
            <div className="space-y-3">{patients.map((patient) => <div key={patient._id} className="border rounded-xl p-4 flex justify-between gap-3"><div><p className="font-semibold">{patient.name}</p><p className="text-sm text-slate-500">{patient.age || 'Age not set'} / {patient.gender || 'Gender not set'}</p></div><select className="text-xs px-2 py-1 h-fit rounded-lg border" value={patient.status} onChange={(event) => updatePatientStatus(patient._id, event.target.value)}><option>Admitted</option><option>Under Treatment</option><option>Under Observation</option><option>Discharged</option></select></div>)}</div>
            {!patients.length && <p className="text-slate-400">No patients assigned yet. Hospital admin can assign patients from the patient profile.</p>}
          </section>
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Schedule</h3>
            <div className="space-y-3">{(workspace?.doctor?.schedule || []).map((slot, index) => <div key={`${slot.day}-${index}`} className="flex justify-between border-b pb-2 text-sm"><span>{slot.day}</span><span className="text-slate-500">{slot.startTime} - {slot.endTime}</span></div>)}</div>
            {!workspace?.doctor?.schedule?.length && <p className="text-sm text-slate-400">No schedule configured.</p>}
          </section>
        </div>
        <section className="bg-white rounded-2xl shadow-sm border p-6 mt-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Appointments</h3>
          <div className="space-y-3">{appointments.map((item) => <div key={item._id} className="border rounded-xl p-4 flex flex-wrap justify-between gap-2"><div><p className="font-semibold">{item.patient?.name || 'Patient'}</p><p className="text-sm text-slate-500">{item.date ? new Date(item.date).toLocaleDateString('en-GB') : 'Date not set'} · {item.time || 'Time not set'}</p></div><span className="text-sm text-indigo-600">{item.status}</span></div>)}</div>
          {!appointments.length && <p className="text-slate-400">No appointments yet.</p>}
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <form onSubmit={(event) => submit(event, '/api/doctors/appointments', appointment, () => setAppointment(emptyAppointment))} className="bg-white rounded-2xl shadow-sm border p-6 space-y-3">
            <h3 className="text-lg font-bold">Book appointment</h3>
            <select required className="w-full border rounded-xl p-2.5" value={appointment.patientId} onChange={(event) => setAppointment({ ...appointment, patientId: event.target.value })}><option value="">Select patient</option>{patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name}</option>)}</select>
            <input required type="date" className="w-full border rounded-xl p-2.5" value={appointment.date} onChange={(event) => setAppointment({ ...appointment, date: event.target.value })} />
            <input required type="time" className="w-full border rounded-xl p-2.5" value={appointment.time} onChange={(event) => setAppointment({ ...appointment, time: event.target.value })} />
            <button disabled={saving} className="w-full bg-indigo-600 text-white rounded-xl py-2.5">Save appointment</button>
          </form>
          <form onSubmit={(event) => submit(event, '/api/doctors/treatments', treatment, () => setTreatment(emptyTreatment))} className="bg-white rounded-2xl shadow-sm border p-6 space-y-3">
            <h3 className="text-lg font-bold">Treatment notes</h3>
            <select required className="w-full border rounded-xl p-2.5" value={treatment.appointmentId} onChange={(event) => setTreatment({ ...treatment, appointmentId: event.target.value })}><option value="">Select appointment</option>{activeAppointments.map((item) => <option key={item._id} value={item._id}>{item.patient?.name} · {item.time}</option>)}</select>
            <input required placeholder="Diagnosis" className="w-full border rounded-xl p-2.5" value={treatment.diagnosis} onChange={(event) => setTreatment({ ...treatment, diagnosis: event.target.value })} />
            <textarea required placeholder="Treatment description" className="w-full border rounded-xl p-2.5" value={treatment.description} onChange={(event) => setTreatment({ ...treatment, description: event.target.value })} />
            <button disabled={saving} className="w-full bg-emerald-600 text-white rounded-xl py-2.5">Save treatment</button>
          </form>
          <form onSubmit={(event) => submit(event, '/api/doctors/prescriptions', { ...prescription, medicines: prescription.medicines.split('\n').filter(Boolean).map((name) => ({ name, dosage: '', frequency: '' })) }, () => setPrescription(emptyPrescription))} className="bg-white rounded-2xl shadow-sm border p-6 space-y-3">
            <h3 className="text-lg font-bold">Prescribe medicines</h3>
            <select required className="w-full border rounded-xl p-2.5" value={prescription.appointmentId} onChange={(event) => setPrescription({ ...prescription, appointmentId: event.target.value })}><option value="">Select appointment</option>{activeAppointments.map((item) => <option key={item._id} value={item._id}>{item.patient?.name} · {item.time}</option>)}</select>
            <textarea required placeholder="One medicine per line" className="w-full border rounded-xl p-2.5" value={prescription.medicines} onChange={(event) => setPrescription({ ...prescription, medicines: event.target.value })} />
            <textarea placeholder="Prescription notes" className="w-full border rounded-xl p-2.5" value={prescription.notes} onChange={(event) => setPrescription({ ...prescription, notes: event.target.value })} />
            <button disabled={saving} className="w-full bg-purple-600 text-white rounded-xl py-2.5">Save prescription</button>
          </form>
        </div>
        {error && <p className="mt-4 text-rose-600">{error}</p>}
      </div>
    </div>
  );
};

export default DoctorDashboard;

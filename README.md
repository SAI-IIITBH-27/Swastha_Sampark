# Swastha Sampark

> **A shared care workspace for patients, doctors, and hospitals.**

Swastha Sampark is built around a simple idea: healthcare coordination should not depend on a patient carrying the entire story from one desk to another.

The platform connects patients, hospital teams, and doctors in one place. A hospital can admit and refer patients, a receiving hospital can accept and take ownership of a case, and the assigned doctor can continue care with the patient's clinical context in view.

It is designed for healthcare teams that need a practical operational layer—not another isolated appointment form.

---

## What makes it useful

### One patient story, across hospitals

Referrals are treated as part of the patient's journey. When a receiving hospital accepts a referral, the patient's current hospital is transferred, the admission status is updated, and the referral history remains available.

### Built around real roles

Each user sees the work that belongs to them:

| Role | What they can do |
| --- | --- |
| **Patient** | View personal details, current hospital, assigned doctor, status, referral history, care history, first-aid guidance, and instructions |
| **Doctor** | Review assigned patients, appointments, schedules, treatment notes, prescriptions, case status, and workload statistics |
| **Hospital administrator** | Register patients, onboard doctors, assign doctors, manage admissions, create referrals, process incoming referrals, and monitor hospital patients |

### Hospital-scoped by default

Hospital administrators do not receive a hospital ID from the browser and get to choose what they can see. The backend derives the hospital from the authenticated token and enforces ownership on patient, doctor, assignment, referral, and status operations.

### Useful before it is perfect

The interface is intentionally operational: clear status badges, compact patient lists, referral panels, appointment views, and focused actions. It avoids turning a busy hospital dashboard into a collection of decorative charts.

---

## Core workflows

### Hospital operations

- Register patients directly under the authenticated hospital
- Generate one-time patient credentials
- Add doctors with a standard or custom speciality
- Generate one-time doctor credentials
- Configure a doctor's working schedule
- Assign doctors to patients
- Track admitted, under-treatment, under-observation, referred, and discharged cases
- Refer a patient to another hospital
- Accept or reject incoming referrals
- Transfer patient ownership when a referral is accepted

### Doctor workspace

- Sign in with hospital-provided credentials
- Change the temporary password on first use
- View assigned patients and their current status
- View scheduled appointments
- Book appointments for assigned patients
- Record diagnosis and treatment notes
- Prescribe medicines
- Update an assigned patient's care status
- Review patient-status statistics and workload counts

### Patient portal

- View the patient's own profile and medical context
- See the current hospital and assigned doctor
- Follow referral history and hospital-care movement
- See current admission/treatment status
- Access basic instructions and first-aid information

---

## Infrastructure at a glance

```text
┌──────────────────────────────┐
│ React 19 + Vite frontend     │
│ Tailwind-style UI + charts   │
└──────────────┬───────────────┘
               │ REST / JSON + JWT
┌──────────────▼───────────────┐
│ Express 5 API                │
│ Role and hospital middleware │
│ Referral and care workflows  │
└──────────────┬───────────────┘
               │ Mongoose
┌──────────────▼───────────────┐
│ MongoDB                      │
│ Patients · Doctors           │
│ Hospitals · Referrals        │
│ Appointments · Treatments    │
│ Prescriptions                │
└──────────────────────────────┘
```

### Technology

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Recharts, Chart.js, Leaflet
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB
- **Authentication:** JWT bearer tokens with bcrypt password hashing
- **Authorization:** Patient, doctor, and hospital-admin role checks with hospital ownership enforcement

---

## Repository layout

```text
.
├── First/
│   ├── backend/
│   │   ├── controllers/     # API and workflow logic
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # REST endpoints
│   │   ├── scripts/         # Import and credential utilities
│   │   └── index.js         # Express entry point
│   └── my-app/
│       ├── src/
│       │   ├── pages/        # Patient, doctor, and hospital portals
│       │   ├── components/  # Shared UI and widgets
│       │   ├── services/    # Central API client
│       │   └── routes/       # Frontend route map
│       └── package.json
└── README.md
```

---

## Run it locally

### Requirements

- Node.js 18+
- npm
- MongoDB locally or a MongoDB Atlas connection string

### 1. Start the API

```bash
cd First/backend
npm install
npm start
```

The API listens on `http://localhost:8000` by default.

Create `First/backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/swastha_sampark
JWT_SECRET=replace-this-in-development
PORT=8000
```

### 2. Start the frontend

In another terminal:

```bash
cd First/my-app
npm install
npm run dev
```

For a local API, configure `First/my-app/.env`:

```env
VITE_API_BASE=http://localhost:8000
```

The Vite development server will print the frontend URL in the terminal.

### Useful frontend commands

```bash
npm run dev       # development server
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview the production build
```

### Optional demo data API

The frontend package also includes the existing JSON Server helper:

```bash
npm run start:api
```

This serves `src/assets/db.json` on port `3001`. It is separate from the MongoDB-backed application API.

---

## API areas

The backend is organized around a small set of focused resources:

```text
/api/hospitals
/api/patients
/api/doctors
/api/referrals
/api/find-route
/api/traffic
```

The most important authenticated workflows include:

- `POST /api/patients/hospital`
- `GET /api/patients/hospital/overview`
- `POST /api/doctors/hospital`
- `GET /api/doctors/workspace`
- `POST /api/doctors/appointments`
- `POST /api/doctors/treatments`
- `POST /api/doctors/prescriptions`
- `POST /api/referrals/hospital`
- `POST /api/referrals/:id/action`

All credential-bearing endpoints should be called over HTTPS outside local development.

---

## Security notes

- Passwords are stored as bcrypt hashes, never as plaintext.
- Hospital-created patient and doctor accounts receive temporary credentials.
- First login can require a password change.
- Patient profile access is restricted to the authenticated patient.
- Doctor workspace data is restricted to the authenticated doctor and their hospital.
- Hospital patient and doctor operations are scoped to the authenticated hospital.
- Frontend filters are for usability; authorization is enforced in the backend.

This project is a working application foundation, not a substitute for a clinical governance program. Before production use, add formal audit logging, encrypted backups, secret management, consent/retention policies, monitoring, and a deployment review appropriate to the jurisdiction and care setting.

---

## Who should use it?

Swastha Sampark is a good fit for:

- Hospitals coordinating admissions and referrals
- Clinics that need a lightweight doctor-and-patient workspace
- Healthcare networks moving away from spreadsheet-driven referrals
- Student and research teams prototyping interoperable care journeys
- Product teams that want a clear base for adding reports, notifications, and clinical records

It is not intended to replace an electronic medical record system without further clinical, legal, security, and operational work.

---

## Current boundaries

The foundation is in place for patient ownership, referrals, doctor assignment, appointments, treatments, prescriptions, and status tracking. More advanced clinical capabilities—such as downloadable medical reports, complete prescription history for patients, notifications, billing, audit trails, and long-term hospital-care records—still need dedicated product and backend design.

That boundary is deliberate: the platform keeps the implemented workflow understandable instead of presenting placeholders as finished clinical features.

---

## Contributing

1. Create a focused branch.
2. Keep changes scoped to one workflow.
3. Preserve backend authorization checks when changing UI behavior.
4. Run the relevant lint, build, and backend syntax checks.
5. Explain data-model or workflow changes in the pull request.

For healthcare-related changes, include the affected role, authorization boundary, and patient-data impact in the PR description.

---

## License

No license has been declared yet. Add a license before redistributing or using this project as a public dependency.

---

<p align="center">
  <strong>Swastha Sampark</strong><br />
  <sub>Less chasing records. More continuity of care.</sub>
</p>
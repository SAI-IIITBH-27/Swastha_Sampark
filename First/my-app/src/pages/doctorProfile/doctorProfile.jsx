import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  MedicalInformation,
  People,
  Schedule,
  Star,
} from "@mui/icons-material";

// Import Chart.js components
import {
  Bar,
  Pie,
  Radar,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

const DoctorProfile = () => {
  const data = {
    totalPatients: 4820,
    activePatients: 312,
    underObservation: 47,
    referrals: 628,
    successRate: 96.3,
    recoveryRate: 88,
    prescriptions: 2140,
    rating: 4.9,
    reviews: 1428,
    satisfaction: 98,
    appointments: { scheduled: 28, followups: 6, urgent: 2 },
    commonMeds: [
      { name: "Lipitor", count: 320 },
      { name: "Metformin", count: 290 },
      { name: "Propranolol", count: 275 },
    ],
    cases: [
      { name: "Hypertension", percent: 34 },
      { name: "Coronary Artery", percent: 22 },
      { name: "Arrhythmia", percent: 12 },
      { name: "Other", percent: 32 },
    ],
  };

  const barData = {
    labels: ["Total Patients", "Active", "Under Obs."],
    datasets: [
      {
        label: "Patients",
        data: [data.totalPatients, data.activePatients, data.underObservation],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  const pieData = {
    labels: ["Scheduled", "Follow-ups", "Urgent"],
    datasets: [
      {
        data: [
          data.appointments.scheduled,
          data.appointments.followups,
          data.appointments.urgent,
        ],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  const radarData = {
    labels: data.cases.map((c) => c.name),
    datasets: [
      {
        label: "Case Distribution",
        data: data.cases.map((c) => c.percent),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "#4BC0C0",
        pointBackgroundColor: "#4BC0C0",
      },
    ],
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
      {/* Header */}
      <Grid container alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Avatar
            src="/doctor-avatar.jpg"
            sx={{ width: 150, height: 150, mx: "auto" }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h4" fontWeight="bold">
            Dr. Emily Carter, MD
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Cardiologist & Internal Medicine Specialist
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Star color="warning" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {data.rating}/5 ({data.reviews} reviews)
            </Typography>
          </Box>
          <Chip label={`${data.satisfaction}% Satisfaction`} color="success" sx={{ mt: 1 }} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {/* Patient Stats */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              <People sx={{ mr: 1 }} />
              Patient Statistics
            </Typography>
            <Bar data={barData} />
          </Paper>
        </Grid>

        {/* Appointments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              <Schedule sx={{ mr: 1 }} />
              Weekly Appointments
            </Typography>
            <Pie data={pieData} />
          </Paper>
        </Grid>

        {/* Success Rate (Gauge Placeholder) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Success Rate
            </Typography>
            <Typography variant="h3" color="success.main">
              {data.successRate}%
            </Typography>
          </Paper>
        </Grid>

        {/* Top Prescriptions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <MedicalInformation sx={{ mr: 1 }} />
              Top Prescriptions
            </Typography>
            <ul>
              {data.commonMeds.map((med) => (
                <li key={med.name}>
                  {med.name} - {med.count}x
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Cases Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Cases
            </Typography>
            <Radar data={radarData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorProfile;

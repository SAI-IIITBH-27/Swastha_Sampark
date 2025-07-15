import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";


const data = [
  { name: "Jan", visits: 2 },
  { name: "Feb", visits: 3 },
  { name: "Mar", visits: 5 },
  { name: "Apr", visits: 1 },
  { name: "May", visits: 4 },
];

const doctorsList = [
  {
    name: "Dr. Anjali Mehra",
    specialization: "Cardiologist",
    hospital: "AIIMS Delhi",
  },
  {
    name: "Dr. Rakesh Sharma",
    specialization: "Dermatologist",
    hospital: "Fortis Noida",
  },
  {
    name: "Dr. Sneha Verma",
    specialization: "Pediatrician",
    hospital: "Apollo Lucknow",
  },
];

// Custom Star Rating Component
const StarRating = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          className="text-2xl cursor-pointer"
          onClick={() => onChange(star)}
          style={{ color: star <= value ? "gold" : "gray" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function UserProfile() {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [review, setReview] = useState("");
  const [selectedReviewDoctor, setSelectedReviewDoctor] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState({
    behavior: 0,
    experience: 0,
    waitTime: 0,
  });

  const filteredDoctors = doctorsList.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const doctorOptions = doctorsList.map((doc) => doc.name);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log({
      doctor: selectedReviewDoctor,
      ...reviewFeedback,
    });
    alert("✅ Review submitted successfully!");
    setSelectedReviewDoctor("");
    setReviewFeedback({ behavior: 0, experience: 0, waitTime: 0 });
  };

  const navigate = useNavigate();// naviagte to registration page


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Logo and Logout */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded shadow">
        <div className="flex items-center space-x-3">
          <img
            src="/SwasthaSamparkLogo.png" // Make sure this path is correct or replace with your image URL
            alt="Swasthya Sampark Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-bold text-blue-700">
            Swasthya Sampark
          </span>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">User Profile Dashboard</h1>

      {/* User Info */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>User ID:</strong> #USR20240708
        </p>
        <p>
          <strong>Name:</strong> Raj Kumar
        </p>
        <p>
          <strong>Age:</strong> 29
        </p>
        <p>
          <strong>Contact:</strong> +91 9876543210
        </p>
      </div>

      {/* Graph */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Doctor Visits Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visits" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reports and Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Recent Reports</h2>
          <ul className="list-disc ml-6">
            <li>Blood Test - Normal</li>
            <li>X-Ray - Minor fracture</li>
            <li>ECG - Normal</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Medications</h2>
          <ul className="list-disc ml-6">
            <li>Paracetamol</li>
            <li>Vitamin D3</li>
            <li>Antibiotics (5-day course)</li>
          </ul>
        </div>
      </div>

      {/* Search Doctors */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Search Doctor in Hospital
        </h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 w-full rounded mb-4"
        />
        <ul>
          {filteredDoctors.map((doc, index) => (
            <li
              key={index}
              className="border-b py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedDoctor(doc)}
            >
              {doc.name} — {doc.specialization} ({doc.hospital})
            </li>
          ))}
        </ul>
        {selectedDoctor && (
          <div className="mt-4 bg-blue-50 p-3 rounded">
            <h3 className="text-lg font-bold">Appointment booked with:</h3>
            <p>
              {selectedDoctor.name} at {selectedDoctor.hospital}
            </p>
          </div>
        )}
      </div>

      {/* Quick Review */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
        <textarea
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your experience..."
          className="border w-full p-2 rounded mb-2"
        />
        <button
          onClick={() => {
            alert("Thanks for your feedback!");
            setReview("");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </div>

      {/* Support Options */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Support & Assistance</h2>
        <button className="bg-green-600 text-white px-4 py-2 mr-3 rounded">
          📞 Call Support
        </button>
        <button className="bg-purple-600  text-white px-4 py-2 mr-3 rounded">
          🤖 AI Chatbot
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          🩺 Consult
        </button>
      </div>

      {/* Detailed Review Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Give Your Feedback</h2>
        <form onSubmit={handleReviewSubmit}>
          <label className="block font-medium mb-1">Select Doctor:</label>
          <select
            value={selectedReviewDoctor}
            onChange={(e) => setSelectedReviewDoctor(e.target.value)}
            className="border px-3 py-2 w-full rounded mb-4"
            required
          >
            <option value="">-- Choose Doctor --</option>
            {doctorOptions.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>

          {/* Star Ratings */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Doctor's Behavior:</label>
            <StarRating
              value={reviewFeedback.behavior}
              onChange={(newRating) =>
                setReviewFeedback({ ...reviewFeedback, behavior: newRating })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Experience:</label>
            <StarRating
              value={reviewFeedback.experience}
              onChange={(newRating) =>
                setReviewFeedback({ ...reviewFeedback, experience: newRating })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Wait Time:</label>
            <StarRating
              value={reviewFeedback.waitTime}
              onChange={(newRating) =>
                setReviewFeedback({ ...reviewFeedback, waitTime: newRating })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

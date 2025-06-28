import React from "react";
import {
  Eye,
  HeartPulse,
  Brain,
  Syringe, // Replace Tooth
  Stethoscope,
} from "lucide-react";

const specialties = [
  {
    title: "Eye Care",
    description: "Comprehensive eye checkups and treatments.",
    icon: <Eye className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Cardiology",
    description: "Heart health management and diagnosis.",
    icon: <HeartPulse className="w-8 h-8 text-red-600" />,
  },
  {
    title: "Neurology",
    description: "Expert care for brain and nervous system.",
    icon: <Brain className="w-8 h-8 text-purple-600" />,
  },
  {
    title: "Vaccination",
    description: "Get vaccinated safely and easily.",
    icon: <Syringe className="w-8 h-8 text-yellow-600" />,
  },
  {
    title: "General Health",
    description: "Everyday health consultations and support.",
    icon: <Stethoscope className="w-8 h-8 text-green-600" />,
  },
];

const SpecialtiesSection = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900">Our Specialties</h2>
        <p className="mt-2 text-gray-600">
          Explore the medical specialties we offer through our connected hospitals and doctors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {specialties.map((item, index) => (
          <div
            key={index}
            className="bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtiesSection;

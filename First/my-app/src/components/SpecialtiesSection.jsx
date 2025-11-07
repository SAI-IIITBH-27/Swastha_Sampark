import React from "react";
import {
  Eye,
  HeartPulse,
  Brain,
  Syringe,
  Stethoscope,
  Users,
  Clock,
  Shield,
} from "lucide-react";

const specialties = [
  {
    title: "Eye Care",
    description: "Comprehensive eye examinations and advanced vision treatments",
    icon: <Eye className="w-6 h-6" />,
    color: "blue",
  },
  {
    title: "Cardiology",
    description: "Advanced heart care with modern diagnostic and treatment facilities",
    icon: <HeartPulse className="w-6 h-6" />,
    color: "red",
  },
  {
    title: "Neurology",
    description: "Expert care for brain and nervous system disorders",
    icon: <Brain className="w-6 h-6" />,
    color: "purple",
  },
  {
    title: "Vaccination",
    description: "Safe and certified vaccination services for all age groups",
    icon: <Syringe className="w-6 h-6" />,
    color: "amber",
  },
  {
    title: "General Medicine",
    description: "Comprehensive healthcare consultations and preventive medicine",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "emerald",
  },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600",
  red: "bg-red-50 text-red-600 border-red-200 group-hover:bg-red-600", 
  purple: "bg-purple-50 text-purple-600 border-purple-200 group-hover:bg-purple-600",
  amber: "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-600",
};

const SpecialtiesSection = () => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-sans">
            Medical Specialties
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Access specialized healthcare services through our network of certified medical professionals and hospitals
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {specialties.map((item, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-indigo-200/60 transition-all duration-300 cursor-pointer"
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center mb-4 transition-all duration-300 ${colorClasses[item.color]}`}>
                <div className="group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Expert Specialists</h3>
              <p className="text-sm text-slate-600">Board-certified doctors and medical professionals</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Quick Access</h3>
              <p className="text-sm text-slate-600">Fast appointments and emergency care availability</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Quality Care</h3>
              <p className="text-sm text-slate-600">Certified facilities with modern medical equipment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtiesSection;
import React from "react";
import HarmonyNav from "../../layouts/Navbar";
import {
  HeartPulse,
  Target,
  Users,
  MapPin,
  Shield,
  Activity,
} from "lucide-react";

const BioPage = () => {
  return (
    <>
      <HarmonyNav />

      {/* Hero Section */}
      <section className="bg-green-400 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-3">Swasthya Sampark</h1>
        <p className="text-lg mb-6">
          Connecting Healthcare, Transforming Lives
        </p>
        <p className="max-w-2xl mx-auto mb-6">
          A comprehensive healthcare referral platform bridging the gap between
          patients, healthcare providers, and medical resources across
          communities.
        </p>
        <button className="bg-white text-green-700 hover:bg-green-100 font-semibold px-6 py-2 rounded-md transition">
          Learn More About Us →
        </button>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-gray-700 mb-10">
          To democratize healthcare access by creating seamless connections
          between patients and healthcare providers, ensuring quality care for
          everyone, everywhere.
        </p>

        <div className="grid md:grid-cols-3 gap-6 px-6 md:px-20">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <HeartPulse className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Patient-Centered Care
            </h3>
            <p className="text-gray-600">
              Ensuring timely, compassionate healthcare referrals tailored to
              patients’ specific needs.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <Target className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Precision Matching
            </h3>
            <p className="text-gray-600">
              Using intelligent algorithms to connect patients with the most
              suitable healthcare providers.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <Users className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Community Building
            </h3>
            <p className="text-gray-600">
              Fostering collaboration between doctors, hospitals, and
              communities for better healthcare outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Key Features
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 mb-10">
          Designed to streamline healthcare referrals and improve patient
          outcomes through technology and innovation.
        </p>

        <div className="grid md:grid-cols-3 gap-6 px-6 md:px-20">
          <div className="bg-gray-50 shadow-sm rounded-xl p-6 hover:shadow-md transition">
            <MapPin className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Real-Time Doctor Mapping
            </h3>
            <p className="text-gray-600">
              Locate available doctors and hospitals in real-time with live data
              integration.
            </p>
          </div>

          <div className="bg-gray-50 shadow-sm rounded-xl p-6 hover:shadow-md transition">
            <Shield className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Emergency Referrals
            </h3>
            <p className="text-gray-600">
              Streamlined emergency routing for critical healthcare needs.
            </p>
          </div>

          <div className="bg-gray-50 shadow-sm rounded-xl p-6 hover:shadow-md transition">
            <Activity className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Medical Resource Tracking
            </h3>
            <p className="text-gray-600">
              Check availability of medicines, tests, and essential medical
              facilities nearby.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BioPage;

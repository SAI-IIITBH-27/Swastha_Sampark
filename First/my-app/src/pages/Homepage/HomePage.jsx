import React, { useEffect } from 'react';
import HarmonyNav from "../../layouts/Navbar";
import AOS from 'aos';
import 'aos/dist/aos.css';

import CarouselSection from '../../components/Carousel/CarouselSection';
import EmergencyWidget from '../../components/EmergencyWidget';
import ChatBotWidget from "../../components/ChatBotWidget";
import SpecialtiesSection from "../../components/SpecialtiesSection";
import Footer from "../../components/Footer/Footer";
import TestimonialSection from "../../components/TestimonialSection";
import Faq from '../../components/Faq';

import { Search, MapPin, Users, Shield, Clock, Heart } from 'lucide-react';

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  const scrollToWhatWeDo = () => {
    document.getElementById("what-we-do").scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "2M+ Patients Served",
      description: "Join millions who trust our healthcare network"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Professionals",
      description: "All doctors and hospitals are thoroughly verified"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Emergency Care",
      description: "Round-the-clock emergency services available"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Comprehensive Care",
      description: "From consultation to emergency referrals"
    }
  ];

  return (
    <>
      <HarmonyNav />

      {/* Enhanced Hero Section */}
      <div className="w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-7xl text-center relative z-10 py-20">
          {/* Top Badge */}
          <div 
            data-aos="fade-down"
            className="inline-flex items-center bg-white/80 backdrop-blur-sm text-indigo-700 font-semibold px-6 py-3 rounded-full text-sm border border-indigo-200 shadow-sm mb-8"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
            🏥 300+ Hospitals & 2000+ Doctors Actively Connected
          </div>

          {/* Main Headline */}
          <h1 
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800 leading-tight mb-6 font-sans"
          >
            Your Health, Our 
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"> Priority</span>
          </h1>

          {/* Subtitle */}
          <p 
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-light"
          >
            Connecting patients with trusted healthcare providers through seamless digital referrals and emergency care coordination
          </p>

          {/* Features Grid */}
          <div 
            data-aos="fade-up"
            data-aos-delay="400"
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
          >
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/80 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-200">
                  <div className="text-indigo-600">
                    {feature.icon}
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-1">{feature.title}</div>
                <div className="text-sm text-slate-500">{feature.description}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Search Box */}
          <div 
            data-aos="fade-up"
            data-aos-delay="500"
            className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-2 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your location or ZIP code"
                  className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
              <button
                onClick={scrollToWhatWeDo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Healthcare Services
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div 
            data-aos="fade-up"
            data-aos-delay="600"
            className="flex flex-wrap justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Instant Referrals</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Verified Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced What We Do Section */}
      <div id="what-we-do" className="px-4 sm:px-6 lg:px-8 bg-white scroll-smooth py-20">
        <div className="max-w-7xl mx-auto">
          <div 
            data-aos="fade-up"
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-sans">Our Healthcare Solutions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive digital healthcare services designed to connect patients with the right medical professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <Users className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Patient Connection</h3>
              <p className="text-slate-600 leading-relaxed">
                Seamlessly connect patients with specialized healthcare providers and hospitals for faster, more efficient medical care.
              </p>
            </div>

            {/* Card 2 */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Shield className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Digital Healthcare</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced platforms for doctors and hospitals to manage appointments, records, and referrals digitally.
              </p>
            </div>

            {/* Card 3 */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <Clock className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Emergency Access</h3>
              <p className="text-slate-600 leading-relaxed">
                Immediate access to emergency services and specialists during critical situations with real-time availability.
              </p>
            </div>

            {/* Card 4 */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <Heart className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Health Awareness</h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive health education, preventive care guidance, and regular check-up recommendations for communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div data-aos="fade-up">
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-indigo-100">Partner Hospitals</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl font-bold mb-2">2,000+</div>
              <div className="text-indigo-100">Verified Doctors</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-indigo-100">Successful Referrals</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Emergency Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Components Sections */}
      <CarouselSection />
      <SpecialtiesSection />
      <EmergencyWidget />
      <ChatBotWidget />
      <TestimonialSection />
      <Faq />
      <Footer />
    </>
  );
};

export default HomePage;
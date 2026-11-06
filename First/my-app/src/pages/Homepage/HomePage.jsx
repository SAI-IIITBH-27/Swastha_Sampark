import React, { useEffect, useState, useRef } from 'react';
import HarmonyNav from "../../layouts/Navbar";
import AOS from 'aos';
import 'aos/dist/aos.css';

import CarouselSection from '../../components/Carousel/CarouselSection';
import EmergencyWidget from '../../components/EmergencyWidget';
import ChatBotWidget from "../../components/ChatBotWidget";
import Footer from "../../components/Footer/Footer";
import TestimonialSection from "../../components/TestimonialSection";
import Faq from '../../components/Faq';

import { 
  Search, 
  MapPin, 
  Activity, 
  FileText, 
  Zap, 
  Shield, 
  Clock, 
  Heart,
  FileCheck2, 
  Stethoscope
} from 'lucide-react';

const HomePage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });

    const handleScroll = () => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;

      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWhatWeDo = () => {
    document.getElementById("what-we-do").scrollIntoView({ behavior: 'smooth' });
  };

  const workflowFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Emergency Referral",
      description: "Directly transfer patients to equipped specialty hospitals without delay."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Live Medical Record Sync",
      description: "Stream past records, diagnostics, and vitals while en route."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Pre-Hospital Preparation",
      description: "Receiving hospital prepares OT and specialists before the patient arrives."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Zero-Delay Onboarding",
      description: "Eliminate repetitive paperwork during critical emergency admissions."
    }
  ];

  return (
    <>
      <HarmonyNav />

      {/* Hero Section */}
      <div className="w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-slate-100/50 to-blue-50/30 relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-7xl relative z-10">
          
          {/* Top Badge */}
          <div className="text-center">
            <div 
              data-aos="fade-down"
              className="inline-flex items-center bg-white/80 backdrop-blur-md text-slate-800 font-medium px-5 py-2.5 rounded-full text-xs sm:text-sm border border-slate-200/80 shadow-sm mb-8 gap-2.5"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-semibold text-slate-900">Swastha Sampark:</span> Emergency Referral & Live Data Sync
            </div>
          </div>

          {/* Main Headline */}
          <h1 
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6 text-center max-w-5xl mx-auto font-sans"
          >
            Faster Hospital Transfers. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Zero-Delay Emergency Care.
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16 text-center font-normal"
          >
            We eliminate treatment delays during emergency patient transfers. While the ambulance is in transit, we securely stream medical records and live vitals so doctors prepare operating rooms before arrival.
          </p>

          {/* Large Frameless Route Visualization */}
          <div data-aos="zoom-in" data-aos-delay="350" ref={trackRef} className="w-full max-w-6xl mx-auto my-8 py-4">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 relative">
              
              {/* Left Hospital Image */}
              <div className="w-full md:w-1/3 flex flex-col items-center text-center group z-10">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-red-400/10 blur-2xl rounded-full scale-125"></div>
                  <img 
                    src="/Hos-left.jpg" 
                    alt="Referring Hospital" 
                    className="w-52 h-36 sm:w-64 sm:h-44 object-cover rounded-3xl drop-shadow-xl transform group-hover:scale-105 transition-all duration-300" 
                  />
                </div>
                
                <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase mb-1">Origin Facility</span>
                <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl">Referring Hospital</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Patient Vitals & History Exported</p>
              </div>

              {/* Center Open Route & Moving Ambulance */}
              <div className="w-full md:w-2/5 px-2 py-6 relative flex flex-col justify-center z-10">
                
                {/* Status Telemetry Text */}
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-4 px-2">
                  <span className={`flex items-center gap-1.5 transition-colors ${scrollProgress < 0.3 ? 'text-indigo-600 font-bold scale-105' : 'text-slate-400'}`}>
                    <FileCheck2 className="w-4 h-4" /> EHR Sent
                  </span>
                  <span className={`flex items-center gap-1.5 transition-colors ${scrollProgress >= 0.3 && scrollProgress < 0.8 ? 'text-red-600 font-bold animate-pulse scale-105' : 'text-slate-400'}`}>
                    <Activity className="w-4 h-4" /> Live Vitals
                  </span>
                  <span className={`flex items-center gap-1.5 transition-colors ${scrollProgress >= 0.8 ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400'}`}>
                    <Stethoscope className="w-4 h-4" /> OT Prepped
                  </span>
                </div>

                {/* Minimalist Seamless Connecting Line */}
                <div className="w-full h-3 bg-slate-200/80 rounded-full relative my-4 shadow-inner">
                  
                  {/* Dynamic Progress Indicator */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-indigo-600 to-blue-600 rounded-full transition-all duration-75"
                    style={{ width: `${scrollProgress * 100}%` }}
                  ></div>
                  
                  {/* Ambulance PNG Element */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-75 z-20 pointer-events-none"
                    style={{ left: `${scrollProgress * 100}%` }}
                  >
                    <div className="relative group flex items-center justify-center">
                      <div className="absolute -inset-2 bg-red-500/30 rounded-full blur-md animate-ping"></div>
                      
                      <img 
                        src="/Ambulance.png" 
                        alt="Ambulance" 
                        className="w-16 h-12 sm:w-20 sm:h-14 object-contain drop-shadow-2xl transform scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Status Subcaption */}
                <div className="text-center mt-3">
                  <span className="inline-block bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200/80 text-xs text-slate-700 font-semibold shadow-sm">
                    {scrollProgress < 0.2 && "Scroll down to observe transit telemetry..."}
                    {scrollProgress >= 0.2 && scrollProgress < 0.8 && "🚑 En Route: Streaming Patient History to Receiving Doctors"}
                    {scrollProgress >= 0.8 && "🏥 Destination Reached: Trauma Bay & Specialists Ready"}
                  </span>
                </div>

              </div>

              {/* Right Hospital Image */}
              <div className="w-full md:w-1/3 flex flex-col items-center text-center group z-10">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-400/10 blur-2xl rounded-full scale-125"></div>
                  
                  <img 
                    src="/Hos-Right.jpg" 
                    alt="Receiving Hospital" 
                    className="w-52 h-36 sm:w-64 sm:h-44 object-cover rounded-3xl drop-shadow-xl transform group-hover:scale-105 transition-all duration-300" 
                  />
                </div>
                
                <span className="text-xs font-mono font-bold text-blue-600 tracking-wider uppercase mb-1">Destination Facility</span>
                <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl">Receiving Hospital</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Zero Admission Delay Preparation</p>
              </div>

            </div>

          </div>

          {/* Workflow Cards */}
          <div 
            data-aos="fade-up"
            data-aos-delay="400"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12 mt-16"
          >
            {workflowFeatures.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Search Box
          <div 
            data-aos="fade-up"
            data-aos-delay="500"
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <MapPin className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter hospital name or emergency zone"
                  className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400 text-sm"
                />
              </div>
              <button
                onClick={scrollToWhatWeDo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                Find Referral Hospitals
              </button>
            </div>
          </div> */}

          {/* Trust Indicators */}
          <div 
            data-aos="fade-up"
            data-aos-delay="600"
            className="flex flex-wrap justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Encrypted Data Transfer</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Reduced Door-to-Doctor Time</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span>Real-Time Vitals Stream</span>
            </div>
          </div>

        </div>
      </div>

      

      {/* Auxiliary Components */}
      <CarouselSection />
      <EmergencyWidget />
      <ChatBotWidget />
      <TestimonialSection />
      <Faq />
      <Footer />
    </>
  );
};

export default HomePage;
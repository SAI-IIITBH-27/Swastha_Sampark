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






const HomePage = () => {
  useEffect(() => {
  AOS.init({
    duration: 800,
    once: false, // Allow repeat animations
    mirror: true, // Optional: animate when scrolling back up
  });
}, []);

  const scrollToWhatWeDo = () => {
    document.getElementById("what-we-do").scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HarmonyNav />

      {/* Hero Section */}
      <div className="w-full flex items-start justify-center px-0 pb-0 bg-white">
        <div className="w-full max-w-7xl text-center shadow-md bg-gradient-to-br from-white via-white to-purple-50 py-10">

          {/* Top Tag */}
          <div className="inline-flex items-center bg-purple-100 text-purple-700 font-medium px-4 py-1 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            300+ hospitals and 2000+ doctors actively enrolling
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mt-4">
            Find The Best <br />
            <span className="text-purple-700">Doctor near you</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-lg text-gray-600">
            Join 2+ million people shaping the future of healthcare.
          </p>

          {/* Search Box */}
          <div className="mt-6 flex justify-center mb-6">
            <div className="flex overflow-hidden shadow-md border-2 border-blue-800 bg-white rounded-md">
              {/* Country Select */}
              <div className="bg-white px-4 py-2 text-gray-700 text-sm flex items-center">
                <select className="bg-transparent outline-none">
                  <option value="US">US</option>
                  <option value="IN">IN</option>
                </select>
              </div>

              {/* Zip Input */}
              <input
                type="text"
                placeholder="ZIP code"
                className="bg-gray-200 text-gray-700 px-4 py-2 w-52 md:w-96 outline-none"
              />

              {/* CTA Button */}
              <button
                onClick={scrollToWhatWeDo}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2"
              >
                Find trials near you
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* What We Do Section */}
      <div id="what-we-do" className="px-4 sm:px-6 lg:px-8 bg-white scroll-smooth">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 mt-8">What We Do</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pb-16">
          
          {/* Card 1 */}
          <div
            data-aos="zoom-in"
            className="bg-purple-50 shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Connect Patients</h3>
            <p className="text-gray-600">
              We help patients find nearby specialists and hospitals for faster and better healthcare services.
            </p>
          </div>

          {/* Card 2 */}
          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            className="bg-purple-50 shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Digitize Healthcare</h3>
            <p className="text-gray-600">
              We provide platforms for doctors and hospitals to manage appointments and records online.
            </p>
          </div>

          {/* Card 3 */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="bg-purple-50 shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Emergency Access</h3>
            <p className="text-gray-600">
              Locate the nearest emergency services and specialists during critical situations.
            </p>
          </div>

          {/* Card 4 */}
          <div
            data-aos="zoom-in"
            data-aos-delay="300"
            className="bg-purple-50 shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Health Awareness</h3>
            <p className="text-gray-600">
              Educating communities with health tips, preventive care, and regular check-up guidance.
            </p>
          </div>
        </div>
      </div>
      {/* //Hospital Carousel component */}
      <CarouselSection />
     
      {/* features */}
      <SpecialtiesSection />

       {/* emergency widget */}
      <EmergencyWidget />

      {/* chat bot */}
      <ChatBotWidget />
      <TestimonialSection />
      <Faq/>
      <Footer />
    </>
  );
};


export default HomePage;

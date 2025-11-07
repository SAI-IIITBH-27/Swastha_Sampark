import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
  const [openItems, setOpenItems] = useState([0]); // First item open by default

  const toggleItem = (index) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "How does the emergency referral system work?",
      answer: "Our emergency referral system connects patients with the nearest available specialized hospitals in real-time. When a medical emergency occurs, healthcare providers can instantly refer patients to facilities with the required specialists and equipment, ensuring timely treatment and reducing critical response times."
    },
    {
      question: "What types of medical specialties are available through your platform?",
      answer: "We offer access to a wide range of medical specialties including Cardiology, Neurology, Emergency Medicine, Orthopedics, Pediatrics, Oncology, and more. Our network includes over 300 hospitals with verified specialists across all major medical disciplines."
    },
    {
      question: "How quickly can I get an emergency appointment?",
      answer: "Emergency cases are prioritized and typically connected with specialists within 15-30 minutes. For critical emergencies, we provide immediate digital referrals to ensure patients receive care at the nearest appropriate facility without delay."
    },
    {
      question: "Is my medical information secure and private?",
      answer: "Yes, we follow strict HIPAA compliance and use advanced encryption to protect all patient data. Your medical information is only shared with authorized healthcare providers involved in your treatment, and we maintain the highest standards of data security and patient privacy."
    },
    {
      question: "Do you accept insurance for emergency services?",
      answer: "We work with most major insurance providers and offer cashless treatment options at our partner hospitals. Our team assists with insurance verification and pre-authorization to ensure smooth financial processing during emergency situations."
    },
    {
      question: "How can I find the nearest hospital with emergency services?",
      answer: "Use our 'Emergency Referral' feature or contact our 24/7 helpline. Our system automatically locates the nearest hospitals with available emergency services, specialist doctors, and required medical equipment based on your location and medical needs."
    },
    {
      question: "What should I do in a medical emergency before help arrives?",
      answer: "Call emergency services (112) immediately. Stay calm, provide clear location details, and follow the operator's instructions. Do not move the patient if there's suspected spinal injury. Our platform can simultaneously alert nearby hospitals while emergency services are en route."
    },
    {
      question: "Can I track my referral status in real-time?",
      answer: "Yes, our platform provides real-time tracking of referral status, including hospital acceptance, estimated arrival time, and treatment progress. Patients and their families receive regular updates through the app or SMS notifications."
    },
    {
      question: "What makes your platform different from other healthcare services?",
      answer: "We specialize in emergency healthcare coordination with real-time hospital availability, instant digital referrals, and seamless patient transfer between facilities. Our focus on emergency response times and specialist connectivity sets us apart in critical care situations."
    },
    {
      question: "How do I register as a patient or healthcare provider?",
      answer: "You can register through our website or mobile app. Patients need basic personal and medical information, while healthcare providers require professional credentials and facility details. The registration process is quick and our team verifies all information to maintain platform quality."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-sans">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get answers to common questions about our healthcare services and emergency referral system
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex items-center justify-between w-full p-6 text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-slate-800 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full mb-4"></div>
                  <p className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our medical support team is available 24/7 to assist you with any questions or concerns about our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200">
                Contact Support
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors duration-200">
                Call Emergency: 112
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
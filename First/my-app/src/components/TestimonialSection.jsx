import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Star, Quote } from "lucide-react";

const TestimonialSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "Cardiologist, Apollo Hospitals",
      image: "../../SwasthaSamparkLogo.png",
      rating: 5,
      text: "Swastha Sampark has revolutionized how we handle emergency referrals. The seamless connectivity between hospitals has saved countless lives through timely interventions.",
      hospital: "Apollo Hospitals"
    },
    {
      id: 2,
      name: "Rahul Mehta",
      role: "Patient",
      image: "../../SwasthaSamparkLogo.png",
      rating: 5,
      text: "During my father's cardiac emergency, Swastha Sampark helped us find the nearest specialized hospital within minutes. The digital referral system made the process incredibly smooth.",
      hospital: "Max Healthcare"
    },
    {
      id: 3,
      name: "Dr. Anil Kumar",
      role: "Neurologist, AIIMS",
      image: "../../SwasthaSamparkLogo.png",
      rating: 5,
      text: "The platform's efficiency in connecting patients with the right specialists has significantly improved our emergency response times. A game-changer in healthcare.",
      hospital: "AIIMS Delhi"
    },
    {
      id: 4,
      name: "Sunita Patel",
      role: "Patient's Family",
      image: "../../SwasthaSamparkLogo.png",
      rating: 5,
      text: "When my mother needed emergency surgery, Swastha Sampark coordinated everything. From finding the right hospital to ensuring proper care, they were with us every step.",
      hospital: "Fortis Healthcare"
    },
    {
      id: 5,
      name: "Dr. Sameer Joshi",
      role: "Emergency Medicine",
      image: "../../SwasthaSamparkLogo.png",
      rating: 5,
      text: "The real-time availability tracking and instant referral system has transformed our emergency department's efficiency. Highly recommended for all healthcare providers.",
      hospital: "Medanta Medicity"
    },
    {
      id: 6,
      name: "Anjali Singh",
      role: "Patient",
      image: "../../SwasthaSamparkLogo.png",
      rating: 5,
      text: "The chatbot helped me understand my symptoms and connected me with the right specialist quickly. The entire digital experience was smooth and reassuring.",
      hospital: "Artemis Hospital"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 font-sans">
            Trusted by Patients & Professionals
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Hear from healthcare providers and patients who have experienced the difference with our platform
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg hover:border-indigo-200/60 transition-all duration-300 group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-indigo-600 opacity-20 group-hover:opacity-30 transition-opacity" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-200"
                />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-xs text-indigo-600 font-medium mt-1">
                    {testimonial.hospital}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 mb-16" data-aos="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-sm text-slate-600">Successful Referrals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">300+</div>
              <div className="text-sm text-slate-600">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">2M+</div>
              <div className="text-sm text-slate-600">Patients Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-sm text-slate-600">Emergency Support</div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="text-center" data-aos="zoom-in">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              See How We're Transforming Healthcare
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Watch how our platform connects patients with healthcare providers in emergency situations
            </p>
          </div>
          
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl border-2 border-indigo-200">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src="https://www.youtube.com/embed/Ut765UT-xRk?si=gp0XjmRohWiQD1FK"
                title="Healthcare Transformation Video"
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
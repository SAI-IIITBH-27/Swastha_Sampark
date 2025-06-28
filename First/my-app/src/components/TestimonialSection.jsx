import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const TestimonialSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const images = [
    "../../SwasthaSamparkLogo.png",
    "../../SwasthaSamparkLogo.png",
    "../../SwasthaSamparkLogo.png",
    "../../SwasthaSamparkLogo.png",
    "../../SwasthaSamparkLogo.png",
    "../../SwasthaSamparkLogo.png",
  ];

  return (
    <div className="bg-white py-20 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        What People Are Saying
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative w-full h-64 overflow-hidden rounded-2xl shadow-lg transition-transform transform hover:scale-105
              ${index % 2 === 0 ? "translate-y-4" : "-translate-y-4"}
            `}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <img
              src={img}
              alt={`Testimonial ${index + 1}`}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ))}

        {/* Center video section */}
        <div
          className="md:col-span-3 flex justify-center mt-10"
          data-aos="zoom-in"
          data-aos-delay="600"
        >
          <div className="w-full flex justify-center px-4">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl border-2 border-purple-300">
              <div className="relative pb-[56.25%] h-0">
                {" "}
                {/* 16:9 aspect ratio */}
                <iframe
                  src="https://www.youtube.com/embed/Ut765UT-xRk?si=gp0XjmRohWiQD1FK"
                  title="Testimonial Video"
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
    </div>
  );
};

export default TestimonialSection;

import React from 'react';

const hospitals = [
  { name: "Apollo Hospitals", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "AIIMS Delhi", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Fortis Healthcare", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Max Healthcare", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Medanta Medicity", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Narayana Health", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Columbia Asia", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Artemis Hospital", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Manipal Hospitals", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Kokilaben Hospital", logo: "../../../SwasthaSamparkLogo.png" },
];

const CarouselSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4 font-sans">
            Trusted Healthcare Partners
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Partnered with leading hospitals across the country to provide you with the best medical care
          </p>
        </div>
        
        {/* Single Carousel Container */}
        <div className="overflow-hidden">
          <div className="flex gap-8 py-4 animate-scroll hover:animate-pause">
            {[...hospitals, ...hospitals].map((hospital, index) => (
              <div
                key={index}
                className="group flex flex-col items-center gap-4 px-8 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 min-w-[200px] relative overflow-hidden hover:-translate-y-1 flex-shrink-0"
              >
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                {/* Logo container */}
                <div className="relative">
                  <div className="w-20 h-20 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300 group-hover:scale-105">
                    <img
                      src={hospital.logo}
                      alt={hospital.name}
                      className="w-12 h-12 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Verified badge */}
                  <div className="absolute -top-2 -right-2 bg-white rounded-lg px-2 py-1 shadow-md border border-slate-200 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-semibold text-slate-700">Verified</span>
                  </div>
                </div>
                
                {/* Hospital name */}
                <span className="font-semibold text-slate-700 text-center group-hover:text-indigo-600 transition-colors duration-300 text-sm">
                  {hospital.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Verified Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>24/7 Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Digital Referrals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind CSS Animations */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 2rem));
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .hover\:animate-pause:hover {
          animation-play-state: paused;
        }
        
        /* Responsive animations */
        @media (max-width: 768px) {
          .animate-scroll {
            animation-duration: 25s;
          }
        }
        
        @media (max-width: 480px) {
          .animate-scroll {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
};

export default CarouselSection;
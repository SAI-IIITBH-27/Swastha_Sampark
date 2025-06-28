import React, { useState } from "react";
import { Phone, MapPin, Clock, Minus, Plus } from "lucide-react";

const EmergencyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleWidget}
        className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all"
      >
        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
      </button>

      {/* Widget Content */}
      {isOpen && (
        <div className="mt-2 bg-white shadow-lg border border-gray-300 rounded-2xl p-4 w-72 space-y-3 transition-all animate-fade-in">
          <h3 className="text-lg font-bold text-red-600">Emergency Contact</h3>

          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-5 h-5 text-red-500" />
            <a href="tel:112" className="hover:underline">
              Call: 112 (Toll-Free)
            </a>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-green-500" />
            <a
              href="https://www.google.com/maps/search/emergency+room+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Locate Nearest ER
            </a>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Avg Response: 10–15 mins</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyWidget;

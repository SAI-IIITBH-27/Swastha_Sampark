import React, { useState } from "react";
import { Phone, MapPin, Clock, Minus, Plus, AlertTriangle, Ambulance, Shield } from "lucide-react";

const EmergencyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  const emergencyContacts = [
    {
      number: "112",
      label: "National Emergency",
      description: "Toll-free emergency number",
      type: "national"
    },
    {
      number: "108",
      label: "Ambulance Service", 
      description: "Medical emergency ambulance",
      type: "ambulance"
    },
    {
      number: "102",
      label: "Medical Help",
      description: "General medical assistance",
      type: "medical"
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Main Toggle Button */}
      <button
        onClick={toggleWidget}
        className="group bg-red-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:bg-red-700 transition-all duration-300 hover:scale-105 flex items-center gap-3"
      >
        <div className="relative">
          <AlertTriangle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
        </div>
        <span className="font-semibold text-sm hidden sm:block">EMERGENCY</span>
        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
      </button>

      {/* Widget Content */}
      {isOpen && (
        <div className="mt-3 bg-white/95 backdrop-blur-sm shadow-2xl border border-red-200 rounded-2xl p-6 w-80 space-y-4 transition-all duration-300 animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Ambulance className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Emergency Services</h3>
              <p className="text-sm text-slate-500">24/7 medical assistance</p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 text-sm">Emergency Numbers</h4>
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors duration-200">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-red-200">
                  <Phone className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <a 
                    href={`tel:${contact.number}`}
                    className="font-semibold text-slate-800 hover:text-red-600 transition-colors block"
                  >
                    {contact.number}
                  </a>
                  <p className="text-xs text-slate-600">{contact.label}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  {contact.type}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-3 border-t border-red-100">
            <h4 className="font-semibold text-slate-700 text-sm">Quick Actions</h4>
            
            {/* Locate Emergency Room */}
            <a
              href="https://www.google.com/maps/search/emergency+room+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                  Locate Nearest ER
                </span>
                <p className="text-xs text-slate-600">Find emergency rooms nearby</p>
              </div>
            </a>

            {/* Response Time Info */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-slate-800">Response Time</span>
                <p className="text-xs text-slate-600">Avg: 8-12 minutes</p>
              </div>
            </div>
          </div>

          {/* Safety Note */}
          <div className="pt-3 border-t border-red-100">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
              <p>Stay calm, provide clear location details, and follow operator instructions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyWidget;
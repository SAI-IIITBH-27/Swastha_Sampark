import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Stethoscope, MapPin, User, DollarSign, Home } from "lucide-react";

function NavItem({ text, onClick, icon }) {
  return (
    <div
      className="flex items-center gap-2 py-3 px-4 cursor-pointer text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 font-medium group"
      onClick={onClick}
    >
      {icon && <div className="text-slate-500 group-hover:text-indigo-600 transition-colors">{icon}</div>}
      <span>{text}</span>
    </div>
  );
}

function HarmonyNav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { text: "Home", onClick: () => navigate("/"), icon: <Home className="w-4 h-4" /> },
    { text: "Find Route", onClick: () => navigate("/find-route"), icon: <MapPin className="w-4 h-4" /> },
    { text: "Bio", onClick: () => navigate("/bio"), icon: <User className="w-4 h-4" /> },
    { text: "Pricing", onClick: () => navigate("/pricing"), icon: <DollarSign className="w-4 h-4" /> },
    { text: "Find Doctors", onClick: () => navigate("/find-doctor"), icon: <Stethoscope className="w-4 h-4" /> },
  ];

  const handleItemClick = (onClick) => {
    onClick();
    setMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm w-full py-4 px-6 sm:px-10 shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo + Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-slate-800 font-sans tracking-tight">
              Swastha Sampark
            </span>
            <p className="text-xs text-slate-500 -mt-1">Healthcare Connection</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/80 rounded-2xl p-2 border border-slate-200/60 shadow-sm">
          {navItems.map((item, index) => (
            <NavItem 
              key={index} 
              text={item.text} 
              onClick={item.onClick} 
              icon={item.icon}
            />
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200 border border-slate-200"
            onClick={() => navigate("/register")}
          >
            Sign In
          </button>
          <button
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>

        {/* Hamburger Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors duration-200"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-lg">
          <div className="flex flex-col p-4 gap-1 max-w-7xl mx-auto">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                text={item.text}
                onClick={() => handleItemClick(item.onClick)}
                icon={item.icon}
              />
            ))}
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
              <button
                className="flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200 text-center"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Sign In
              </button>
              <button
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 text-center"
                onClick={() => {
                  navigate("/register");
                  setMenuOpen(false);
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default HarmonyNav;
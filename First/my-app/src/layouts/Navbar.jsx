import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For icons

function NavItem({ text, onClick }) {
  return (
    <div
      className="py-2 px-3 cursor-pointer hover:text-purple-700 transition-all"
      onClick={onClick}
    >
      {text}
    </div>
  );
}

function HarmonyNav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { text: "Find Route", onClick: () => navigate("/find-route") },
    { text: "Bio", onClick: () => navigate("/bio") },
    { text: "Pricing", onClick: () => navigate("/pricing") },
    { text: "Find Doctors", onClick: () => navigate("/find-doctor") },
    { text: "Home", onClick: () => navigate("/") },
  ];

  const handleItemClick = (onClick) => {
    onClick();
    setMenuOpen(false); // Close menu after click (mobile)
  };

  return (
    <header className="bg-white w-full py-4 px-6 sm:px-10 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <img
            src="../../SwasthaSamparkLogo.png"
            alt="Logo"
            className="w-12 h-12"
          />
          <span className="uppercase font-extrabold text-lg text-zinc-900">
            Swastha Sampark
          </span>
        </div>

        {/* Hamburger Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-800 hover:text-purple-700 focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6 text-base font-light text-neutral-900 text-center">
          {navItems.map((item, index) => (
            <NavItem key={index} text={item.text} onClick={item.onClick} />
          ))}
        </nav>

        {/* CTA Button */}
        <button
          className="hidden sm:block bg-neutral-900 text-white px-6 py-2 text-base hover:bg-neutral-800 transition-all"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col mt-4 gap-3 text-base font-light text-neutral-900 text-center">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              text={item.text}
              onClick={() => handleItemClick(item.onClick)}
            />
          ))}
          <button
            className="mt-2 bg-neutral-900 text-white px-6 py-2 text-base hover:bg-neutral-800 transition-all w-fit mx-auto"
            onClick={() => {
              navigate("/register");
              setMenuOpen(false);
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}

export default HarmonyNav;

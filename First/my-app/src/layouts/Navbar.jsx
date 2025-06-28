import React from "react";
import { useNavigate } from "react-router-dom";

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

  const navItems = [
    { text: "Find Route", onClick: () => navigate("/find-route") },
    { text: "Bio", onClick: () => navigate("/bio") },
    { text: "Pricing", onClick: () => navigate("/pricing") },
    { text: "FAQ", onClick: () => navigate("/faq") },
  ];

  return (
    <header className="bg-white w-full py-4 px-6 sm:px-10 shadow-md flex flex-col sm:flex-row justify-between items-center">
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

      {/* Nav Items */}
      <nav className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 text-base font-light text-neutral-900 text-center">
        {navItems.map((item, index) => (
          <NavItem key={index} text={item.text} onClick={item.onClick} />
        ))}
      </nav>

      {/* CTA Button */}
      <button
        className="mt-4 sm:mt-0 bg-neutral-900 text-white px-6 py-2 text-base hover:bg-neutral-800 transition-all"
        onClick={() => alert("Download Now button clicked")}
      >
        Signup
      </button>
    </header>
  );
}

export default HarmonyNav;

import React from 'react';
import './CarouselSection.css'; // External CSS for animation

const hospitals = [
  { name: "Apollo", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "AIIMS", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Fortis", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Max Healthcare", logo: "/../../../SwasthaSamparkLogo.png" },
  { name: "Medanta", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Narayana", logo: "../../../SwasthaSamparkLogo.png" },
  { name: "Columbia Asia", logo: "/../../../SwasthaSamparkLogo.png" },
];

const CarouselRow = ({ speedClass }) => (
  <div className={`carousel-row ${speedClass}`}>
    {[...hospitals, ...hospitals].map((hospital, index) => (
      <div key={index} className="hospital-card">
        <img src={hospital.logo} alt={hospital.name} />
        <span>{hospital.name}</span>
      </div>
    ))}
  </div>
);

const CarouselSection = () => {
  return (
    <div className="carousel-container">
      <CarouselRow speedClass="scroll-slow" />
      <CarouselRow speedClass="scroll-medium reverse" />
      <CarouselRow speedClass="scroll-fast" />
    </div>
  );
};

export default CarouselSection;

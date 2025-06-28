import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const [form, setForm] = useState({ email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .send(
        "YOUR_SERVICE_ID", // replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID", // replace with your EmailJS Template ID
        form,
        "YOUR_PUBLIC_KEY" // replace with your Public Key
      )
      .then(
        () => {
          setStatus("Message sent successfully!");
          setForm({ email: "", message: "" });
        },
        () => {
          setStatus("Failed to send message. Try again.");
        }
      );
  };

  return (
    <footer className="bg-gray-900 text-white py-12 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400">Your Friend</h2>
          <p className="mt-2 text-sm text-gray-400">
            Connecting you to the best healthcare providers anytime, anywhere.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center text-sm text-gray-400 mb-2">
            <MapPin className="w-4 h-4 mr-2" /> Your City, Your Country
          </p>
          <p className="flex items-center text-sm text-gray-400 mb-2">
            <Phone className="w-4 h-4 mr-2" /> +91 000000000
          </p>
          <p className="flex items-center text-sm text-gray-400">
            <Mail className="w-4 h-4 mr-2" /> email
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li><a href="#home" className="hover:text-purple-400">Home</a></li>
            <li><a href="#what-we-do" className="hover:text-purple-400">Services</a></li>
            <li><a href="#specialties" className="hover:text-purple-400">Specialties</a></li>
            <li><a href="#contact" className="hover:text-purple-400">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
          <form onSubmit={sendEmail} className="space-y-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-sm"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-sm"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Send Message
            </button>
            {status && <p className="text-sm mt-2 text-gray-400">{status}</p>}
          </form>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Swasth Sampark. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

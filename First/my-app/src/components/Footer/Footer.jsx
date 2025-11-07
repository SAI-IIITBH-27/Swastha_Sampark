import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Mail, MapPin, Phone, Heart, Stethoscope, Shield, Clock, ArrowRight } from "lucide-react";

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
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form,
        "YOUR_PUBLIC_KEY"
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
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-sans">Swastha Sampark</h2>
                <p className="text-sm text-slate-400">Healthcare Connection Platform</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Connecting patients with trusted healthcare providers through seamless digital referrals and emergency care coordination.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant & Secure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Find Doctors", href: "/find-doctor" },
                { name: "Emergency Referral", href: "/find-route" },
                { name: "Patient Portal", href: "/bio" },
                { name: "Medical Specialties", href: "#specialties" },
                { name: "Pricing", href: "/pricing" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400" />
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Headquarters</p>
                  <p className="text-slate-400 text-sm">Delhi, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Emergency Helpline</p>
                  <p className="text-slate-400 text-sm">112 (Toll-Free)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Email Support</p>
                  <p className="text-slate-400 text-sm">support@swasthasampark.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Support Hours</p>
                  <p className="text-slate-400 text-sm">24/7 Emergency Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              Send Message
            </h3>
            <form onSubmit={sendEmail} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Message
              </button>
              {status && (
                <p className={`text-sm mt-2 text-center ${
                  status.includes("successfully") ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Committed to your health and well-being</span>
            </div>
            
            <div className="text-slate-400 text-sm text-center md:text-right">
              <p>© {new Date().getFullYear()} Swastha Sampark. All rights reserved.</p>
              <p className="text-xs mt-1">HIPAA Compliant • ISO Certified • Medical Grade Security</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
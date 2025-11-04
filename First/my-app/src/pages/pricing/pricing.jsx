import React from "react";
import HarmonyNav from "../../layouts/Navbar";
import { CheckCircle2, HeartPulse, Star, Shield } from "lucide-react";

const PricingPage = () => {
  return (
    <>
      <HarmonyNav />

      {/* Hero Section */}
      <section className="bg-violet-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-3">Our Pricing Plans</h1>
        <p className="text-lg mb-6">
          Simple, transparent, and built for everyone
        </p>
        <p className="max-w-2xl mx-auto mb-6">
          Choose a plan that fits your healthcare needs — from individuals to
          hospitals and networks.
        </p>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-violet-700 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Affordable plans designed to make healthcare access easy and
            efficient for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-6 md:px-20">
          {/* Basic Plan */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg border-t-4 border-violet-400 transition">
            <HeartPulse className="w-10 h-10 text-violet-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-violet-700 mb-2">
              Basic
            </h3>
            <p className="text-gray-600 mb-4">
              For individuals and small clinics.
            </p>
            <p className="text-4xl font-bold text-gray-800 mb-6">
              ₹99<span className="text-lg text-gray-500">/month</span>
            </p>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Basic referral
                system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Access to nearby
                doctors
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Email support
              </li>
            </ul>
            <button className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition">
              Choose Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-violet-600 transform scale-105">
            <Star className="w-10 h-10 text-violet-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-violet-700 mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">
              Perfect for hospitals and health networks.
            </p>
            <p className="text-4xl font-bold text-gray-800 mb-6">
              ₹499<span className="text-lg text-gray-500">/month</span>
            </p>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Real-time doctor
                tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Priority referrals
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> 24/7 support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Analytics dashboard
              </li>
            </ul>
            <button className="bg-violet-700 text-white px-6 py-2 rounded-md hover:bg-violet-800 transition">
              Get Started
            </button>
          </div>
          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg border-t-4 border-violet-400 transition">
            <Shield className="w-10 h-10 text-violet-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-violet-700 mb-2">
              Enterprise
            </h3>
            <p className="text-gray-600 mb-4">
              For large organizations and governments.
            </p>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              Custom Pricing
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Tailored solutions for your organization's needs
            </p>

            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> All Pro features
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Custom integrations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> Dedicated manager
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-violet-600" /> API access
              </li>
            </ul>

            <button className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-700 text-white text-center py-16">
        <h2 className="text-3xl font-semibold mb-4">Still not sure?</h2>
        <p className="max-w-xl mx-auto mb-6">
          Get in touch with our team and discover how Swasthya Sampark can
          support your healthcare network.
        </p>
        <button className="bg-white text-violet-700 font-semibold px-6 py-2 rounded-md hover:bg-violet-100 transition">
          Contact Us →
        </button>
      </section>
    </>
  );
};

export default PricingPage;

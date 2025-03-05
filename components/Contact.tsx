"use client";

import React, { useState } from "react";
import { Send, Phone, Mail, MapPin, Check } from "lucide-react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "General Inquiry"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success state
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        subject: "General Inquiry"
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-lilita mb-4">Contact Us</h1>
        <div className="w-16 sm:w-24 h-2 bg-[#FFC936] mx-auto mb-6 rounded-full"></div>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-700 px-4">
          Have questions about adopting a dog? Want to volunteer or donate? Our team is here to help with any questions about bringing a new furry friend into your life.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-transform hover:scale-105">
          <div className="w-16 h-16 bg-[#FFC936] rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone size={28} className="text-white" />
          </div>
          <h3 className="font-lilita text-xl sm:text-2xl text-center mb-4">Call Us</h3>
          <p className="text-center text-gray-700 mb-4">
            Our adoption specialists are ready to answer your questions during business hours.
          </p>
          <p className="text-center font-semibold text-lg">(555) 123-4567</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-transform hover:scale-105">
          <div className="w-16 h-16 bg-[#FFC936] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-white" />
          </div>
          <h3 className="font-lilita text-xl sm:text-2xl text-center mb-4">Email Us</h3>
          <p className="text-center text-gray-700 mb-4">
            Send us a message anytime. We typically respond within 24 hours on weekdays.
          </p>
          <p className="text-center font-semibold text-lg">woof@pawfectmatch.com</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-transform hover:scale-105 sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0 sm:max-w-md lg:max-w-none">
          <div className="w-16 h-16 bg-[#FFC936] rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={28} className="text-white" />
          </div>
          <h3 className="font-lilita text-xl sm:text-2xl text-center mb-4">Visit Us</h3>
          <p className="text-center text-gray-700 mb-4">
            Come meet our adoptable dogs in person at our adoption center and play area.
          </p>
          <p className="text-center font-semibold text-lg">123 Paw Avenue, Dogtown, CA 90210</p>
        </div>
      </div>

      {/* Map and Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 bg-white rounded-2xl shadow-xl overflow-hidden mt-8 sm:mt-12">
        {/* Map Section */}
        <div className="h-64 sm:h-80 lg:h-full bg-gray-200 order-2 lg:order-1">
          <iframe 
            src="https://www.openstreetmap.org/export/embed.html?bbox=-118.5%2C33.7%2C-118.1%2C34.1&layer=mapnik"
            className="w-full h-full border-0"
            title="Map location"
            aria-hidden="true"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div className="p-6 sm:p-8 lg:p-12 order-1 lg:order-2">
          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="font-lilita text-2xl mb-4">Message Sent!</h3>
              <p className="text-gray-700">
                Thank you for reaching out! We'll get back to you as soon as possible to help with your adoption journey.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-lilita text-2xl sm:text-3xl mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-lilita">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC936]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-lilita">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC936]"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-lilita">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC936]"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block mb-2 font-lilita">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC936]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Adoption Process">Adoption Process</option>
                      <option value="Volunteering">Volunteering</option>
                      <option value="Donation">Donation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 font-lilita">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC936] resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-lilita text-lg flex items-center justify-center gap-2 transition-colors ${
                    isSubmitting 
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed" 
                      : "bg-[#FFC936] hover:bg-[#FFB800] text-black"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Hours Section */}
      <div className="mt-16 text-center px-4">
        <h2 className="font-lilita text-2xl sm:text-3xl mb-8">Our Hours</h2>
        <div className="inline-flex flex-col bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-base sm:text-lg">
            <div className="font-semibold text-right border-r pr-3 sm:pr-4">Monday - Friday:</div>
            <div className="text-left pl-3 sm:pl-4">9:00 AM - 6:00 PM</div>
            
            <div className="font-semibold text-right border-r pr-3 sm:pr-4">Saturday:</div>
            <div className="text-left pl-3 sm:pl-4">10:00 AM - 4:00 PM</div>
            
            <div className="font-semibold text-right border-r pr-3 sm:pr-4">Sunday:</div>
            <div className="text-left pl-3 sm:pl-4">Closed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
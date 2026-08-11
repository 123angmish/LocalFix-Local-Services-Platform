import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl text-white">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Wrench className="w-5 h-5" />
              </div>
              <span>Local<span className="text-emerald-400">Fix</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted platform for booking verified local experts including plumbers, electricians, salon professionals, and home appliance technicians.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-white transition">Browse Services</Link></li>
              <li><Link to="/ai-recommender" className="hover:text-white transition">AI Assistant</Link></li>
              <li><Link to="/register?type=vendor" className="hover:text-white transition">Become a Vendor</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Account Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services?category=Plumber" className="hover:text-white transition">Plumbing Repairs</Link></li>
              <li><Link to="/services?category=Electrician" className="hover:text-white transition">Electrical & Wiring</Link></li>
              <li><Link to="/services?category=Salon" className="hover:text-white transition">Home Beauty Salon</Link></li>
              <li><Link to="/services?category=Cleaner" className="hover:text-white transition">Deep Home Cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Customer Support</h4>
            <div className="text-xs space-y-2 text-slate-400">
              <p>📍 Available across top major cities in India.</p>
              <p>⏱️ Instant booking confirmation & verified professionals.</p>
              <p>🛡️ 100% Satisfaction Guarantee & Transparent Pricing.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} LocalFix Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Built with <Heart className="w-4 h-4 text-red-500 fill-current" /> for high quality local service booking.
          </p>
        </div>
      </div>
    </footer>
  );
};

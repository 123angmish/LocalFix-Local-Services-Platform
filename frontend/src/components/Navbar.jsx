import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Sparkles, User, LogOut, LayoutDashboard, Menu, X, ShieldAlert, Calendar, MapPin, ShieldCheck, FileText, Building, Users, Navigation, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real GPS & Location State
  const [currentCity, setCurrentCity] = useState('Delhi NCR');
  const [detectedArea, setDetectedArea] = useState('Connaught Place');
  const [locating, setLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocating(false);

        let matchedCity = 'Delhi NCR';
        let matchedArea = `GPS: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;

        if (lat >= 26.5 && lat <= 27.5 && lng >= 75.0 && lng <= 76.5) {
          matchedCity = 'Jaipur';
          matchedArea = 'Pink City, Jaipur';
        } else if (lat >= 28.3 && lat <= 29.0 && lng >= 76.8 && lng <= 77.5) {
          matchedCity = 'Delhi NCR';
          matchedArea = 'Connaught Place, New Delhi';
        } else if (lat >= 18.8 && lat <= 19.4 && lng >= 72.7 && lng <= 73.1) {
          matchedCity = 'Mumbai';
          matchedArea = 'Bandra West, Mumbai';
        } else if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) {
          matchedCity = 'Bengaluru';
          matchedArea = 'Indiranagar, Bengaluru';
        }

        setCurrentCity(matchedCity);
        setDetectedArea(matchedArea);
        toast.success(`📍 Location Detected: ${matchedCity} (${matchedArea})`);
      },
      (err) => {
        setLocating(false);
        setCurrentCity('Delhi NCR');
        setDetectedArea('Connaught Place, New Delhi');
        toast.success("Location set to Connaught Place, Delhi NCR");
      },
      { timeout: 6000, enableHighAccuracy: true }
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-emerald-600 tracking-tight">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
                <Wrench className="w-5 h-5" />
              </div>
              <span>Local<span className="text-slate-900">Fix</span></span>
            </Link>

            {/* GPS Location Pill */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={locating}
              title="Detect GPS Location"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 text-xs font-bold text-emerald-950 transition"
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${locating ? 'animate-spin' : ''}`} />
              <span>📍 {currentCity} ({detectedArea})</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-3 text-xs">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link
                      to="/customer/dashboard"
                      className={`px-3 py-2 font-bold rounded-lg flex items-center gap-1.5 transition ${
                        isActive('/customer/dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-600'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Bookings
                    </Link>
                    <Link
                      to="/repair-passport"
                      className={`px-3 py-2 font-bold rounded-lg flex items-center gap-1.5 transition ${
                        isActive('/repair-passport') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-600'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Repair Passport
                    </Link>
                    <Link
                      to="/ai-recommender"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:opacity-90 font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      AI Assistant
                    </Link>
                  </>
                )}

                {(user.role === 'VENDOR' || user.role === 'PROVIDER') && (
                  <>
                    <Link
                      to="/vendor/dashboard"
                      className={`px-3 py-2 font-bold rounded-lg flex items-center gap-1.5 transition ${
                        isActive('/vendor/dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-600'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      Incoming Jobs Queue
                    </Link>
                    <Link
                      to="/vendor/services"
                      className={`px-3 py-2 font-bold rounded-lg flex items-center gap-1.5 transition ${
                        isActive('/vendor/services') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-600'
                      }`}
                    >
                      <Wrench className="w-4 h-4 text-emerald-600" />
                      Manage Services
                    </Link>
                    <Link
                      to="/vendor/crm"
                      className="px-3 py-2 font-extrabold text-emerald-800 bg-emerald-100/70 rounded-lg flex items-center gap-1.5 border border-emerald-200 transition"
                    >
                      <Users className="w-4 h-4 text-emerald-700" />
                      Technician SaaS CRM
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Portal
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Dedicated Role-Based Sign In Buttons for Guests */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login?type=customer"
                  className="px-3 py-2 font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Customer Sign In</span>
                </Link>
                <Link
                  to="/login?type=vendor"
                  className="px-4 py-2 font-extrabold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Vendor Partner Portal</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <>
                  <Link to="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-800">
                    My Customer Bookings
                  </Link>
                  <Link to="/repair-passport" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-800">
                    Digital Repair Passport
                  </Link>
                  <Link to="/ai-recommender" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-emerald-700">
                    ✨ AI Assistant
                  </Link>
                </>
              )}
              {(user.role === 'VENDOR' || user.role === 'PROVIDER') && (
                <>
                  <Link to="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-800">
                    Incoming Jobs Queue
                  </Link>
                  <Link to="/vendor/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-800">
                    Manage Service Listings
                  </Link>
                  <Link to="/vendor/crm" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-emerald-700">
                    Technician SaaS CRM
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm font-bold text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link to="/login?type=customer" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-xs font-bold text-slate-800 border border-slate-200 rounded-xl">
                Customer Sign In
              </Link>
              <Link to="/login?type=vendor" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-xs font-bold bg-slate-900 text-white rounded-xl">
                Vendor Partner Portal Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

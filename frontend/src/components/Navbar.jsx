import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Sparkles, User, LogOut, LayoutDashboard, Menu, X, ShieldAlert, Calendar, MapPin, ShieldCheck, FileText, Building, Users, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real GPS & Location State with City-to-Area Mapping
  const [currentCity, setCurrentCity] = useState('Delhi NCR');
  const [detectedArea, setDetectedArea] = useState('Connaught Place');
  const [locating, setLocating] = useState(false);

  const cityAreaMap = {
    'Delhi NCR': 'Connaught Place, New Delhi',
    'Jaipur': 'Malviya Nagar, Pink City',
    'Mumbai': 'Bandra West, Mumbai',
    'Bengaluru': 'Indiranagar, Bengaluru',
    'Hyderabad': 'Gachibowli, Hyderabad',
    'Pune': 'Koregaon Park, Pune',
    'Noida': 'Sector 62, Noida / Cyber Hub',
    'Chennai': 'T. Nagar, Chennai',
    'Kolkata': 'Salt Lake, Kolkata',
    'Dubai': 'Downtown Dubai 🇦🇪'
  };

  const handleCityChange = (newCity) => {
    setCurrentCity(newCity);
    const area = cityAreaMap[newCity] || 'City Center';
    setDetectedArea(area);
    toast.success(`Location updated to ${newCity} (${area})`);
    // Navigate to filtered services if on services page or browse
    if (location.pathname === '/services') {
      navigate(`/services?city=${encodeURIComponent(newCity)}`);
    }
  };

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

        // Geolocation latitude bounding check for North India (Delhi/Jaipur) vs West India (Mumbai)
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
        toast.success(`📍 Precise Location Detected: ${matchedCity} (${matchedArea})`);
        
        if (location.pathname === '/services') {
          navigate(`/services?city=${encodeURIComponent(matchedCity)}`);
        }
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
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-emerald-600 tracking-tight">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
                <Wrench className="w-5 h-5" />
              </div>
              <span>Local<span className="text-slate-900">Fix</span></span>
            </Link>

            <div className="hidden md:flex ml-6 space-x-3 items-center text-xs font-semibold">
              {/* Real GPS & City Location Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 rounded-full border border-emerald-200 text-xs font-bold text-emerald-950">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  title="Detect GPS Current Location"
                  className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-200 rounded-full transition flex items-center gap-1"
                >
                  <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                </button>

                <select
                  value={currentCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="bg-transparent font-extrabold text-emerald-900 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Delhi NCR">📍 Delhi NCR ({currentCity === 'Delhi NCR' ? detectedArea : 'Connaught Place'})</option>
                  <option value="Jaipur">📍 Jaipur ({currentCity === 'Jaipur' ? detectedArea : 'Pink City'})</option>
                  <option value="Mumbai">📍 Mumbai ({currentCity === 'Mumbai' ? detectedArea : 'Bandra West'})</option>
                  <option value="Bengaluru">📍 Bengaluru ({currentCity === 'Bengaluru' ? detectedArea : 'Indiranagar'})</option>
                  <option value="Hyderabad">📍 Hyderabad ({currentCity === 'Hyderabad' ? detectedArea : 'Gachibowli'})</option>
                  <option value="Pune">📍 Pune ({currentCity === 'Pune' ? detectedArea : 'Koregaon Park'})</option>
                  <option value="Noida">📍 Noida / Gurugram ({currentCity === 'Noida' ? detectedArea : 'Sector 62'})</option>
                  <option value="Chennai">📍 Chennai ({currentCity === 'Chennai' ? detectedArea : 'T. Nagar'})</option>
                  <option value="Kolkata">📍 Kolkata ({currentCity === 'Kolkata' ? detectedArea : 'Salt Lake'})</option>
                  <option value="Dubai">📍 Dubai 🇦🇪</option>
                </select>
              </div>

              <Link
                to="/services"
                className={`px-3 py-2 rounded-lg ${
                  isActive('/services') ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Browse Services
              </Link>
              <Link
                to="/ai-recommender"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:opacity-90 transition`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI Assistant
              </Link>
              <Link
                to="/quotes"
                className={`px-3 py-2 rounded-lg ${
                  isActive('/quotes') ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quotes
              </Link>
              <Link
                to="/society-dashboard"
                className={`px-3 py-2 rounded-lg ${
                  isActive('/society-dashboard') ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Society / PG
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link
                      to="/customer/dashboard"
                      className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/repair-passport"
                      className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Repair Passport
                    </Link>
                  </>
                )}
                {(user.role === 'VENDOR' || user.role === 'PROVIDER') && (
                  <>
                    <Link
                      to="/vendor/dashboard"
                      className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Vendor Portal
                    </Link>
                    <Link
                      to="/vendor/crm"
                      className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg flex items-center gap-1.5 border border-emerald-200 transition"
                    >
                      <Users className="w-4 h-4 text-emerald-600" />
                      Technician SaaS CRM
                    </Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Portal
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
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
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition shadow-emerald-200"
                >
                  Get Started
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
          <button
            type="button"
            onClick={handleDetectLocation}
            className="w-full text-left py-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 rounded-xl border border-emerald-200"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>Detect GPS Location ({currentCity} - {detectedArea})</span>
          </button>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
            Browse Services
          </Link>
          <Link to="/ai-recommender" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-emerald-600 font-semibold">
            ✨ AI Assistant
          </Link>
          <Link to="/quotes" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
            Quotes Marketplace
          </Link>
          <Link to="/society-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
            Society / PG Mode
          </Link>

          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <>
                  <Link to="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
                    Customer Dashboard
                  </Link>
                  <Link to="/repair-passport" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
                    Repair Passport
                  </Link>
                  <Link to="/warranties" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
                    Active Warranties
                  </Link>
                </>
              )}
              {(user.role === 'VENDOR' || user.role === 'PROVIDER') && (
                <>
                  <Link to="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
                    Vendor Portal
                  </Link>
                  <Link to="/vendor/crm" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-emerald-700 font-bold">
                    Technician SaaS CRM
                  </Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-700">
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm font-medium text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

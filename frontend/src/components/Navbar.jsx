import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Sparkles, User, LogOut, LayoutDashboard, Menu, X, ShieldAlert, Calendar, MapPin, ShieldCheck, FileText, Building, Users, Navigation, Briefcase, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real GPS & Location State
  const [currentCity, setCurrentCity] = useState(localStorage.getItem('localfix_city') || 'Select Location');
  const [detectedArea, setDetectedArea] = useState(localStorage.getItem('localfix_area') || 'GPS / City Search');
  const [locating, setLocating] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualCityInput, setManualCityInput] = useState('');

  const popularCities = [
    'Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune',
    'Kolkata', 'Chennai', 'Jaipur', 'Lucknow', 'Ahmedabad',
    'Chandigarh', 'Indore', 'Patna', 'Kochi', 'Surat'
  ];

  // Real OpenStreetMap Reverse Geocoding
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Fetch exact address details via OpenStreetMap Nominatim reverse geocoding API
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();

          const addr = data.address || {};
          const cityFound = addr.city || addr.town || addr.city_district || addr.state_district || addr.state || 'Local City';
          const areaFound = addr.suburb || addr.neighbourhood || addr.road || addr.county || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;

          setCurrentCity(cityFound);
          setDetectedArea(areaFound);
          localStorage.setItem('localfix_city', cityFound);
          localStorage.setItem('localfix_area', areaFound);
          toast.success(`📍 Real GPS Location Detected: ${cityFound} (${areaFound})`);
        } catch (err) {
          const fallbackArea = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
          setCurrentCity('Current GPS Location');
          setDetectedArea(fallbackArea);
          toast.success(`📍 Coordinates: ${fallbackArea}`);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setIsLocationModalOpen(true);
        toast.error("GPS access denied or unavailable. Please select your city manually.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (cityName) => {
    setCurrentCity(cityName);
    setDetectedArea(`${cityName} Metro`);
    localStorage.setItem('localfix_city', cityName);
    localStorage.setItem('localfix_area', `${cityName} Metro`);
    setIsLocationModalOpen(false);
    toast.success(`📍 Location set to ${cityName}`);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCityInput.trim()) return;
    handleSelectCity(manualCityInput.trim());
    setManualCityInput('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
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

              {/* GPS Location Button & Selector */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  title="Detect GPS Location"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 text-xs font-bold text-emerald-950 transition"
                >
                  <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${locating ? 'animate-spin' : ''}`} />
                  <span>📍 {currentCity} ({detectedArea})</span>
                </button>

                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-xs font-bold text-emerald-700 underline hover:text-emerald-800"
                >
                  Change City
                </button>
              </div>
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
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition flex items-center gap-2 text-xs"
                  >
                    <User className="w-4 h-4 text-white" />
                    <span>Sign In / Register</span>
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
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-xs font-extrabold bg-emerald-600 text-white rounded-xl shadow-sm">
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Real Location Selector Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Select Your Location</h3>
                  <p className="text-xs text-slate-500">Choose your city or enter custom area / pincode</p>
                </div>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Auto-Detect Button */}
            <button
              onClick={() => {
                setIsLocationModalOpen(false);
                handleDetectLocation();
              }}
              className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Use Precise GPS Location</span>
            </button>

            {/* Custom City / Area Form */}
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Enter City, Locality, or Pincode:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={manualCityInput}
                  onChange={(e) => setManualCityInput(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai or 110001"
                  className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition"
                >
                  Set Location
                </button>
              </div>
            </form>

            {/* Popular Cities Grid */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Popular Cities:</label>
              <div className="grid grid-cols-3 gap-2">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition flex items-center justify-between ${
                      currentCity === city ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{city}</span>
                    {currentCity === city && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

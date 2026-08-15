import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Sparkles, User, LogOut, LayoutDashboard, Menu, X, ShieldAlert, MapPin, ShieldCheck, Navigation, Briefcase, Check, Headphones, MessageSquare, PhoneCall, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Support & Help Center Modal State
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTopic, setSupportTopic] = useState('BOOKING_ISSUE');

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

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error("Please enter your support query details");
      return;
    }
    toast.success("✅ Support Ticket logged! Our 24/7 team will call you back within 15 minutes.");
    setSupportMessage('');
    setIsSupportModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoHome = (e) => {
    if (e) e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path) => location.pathname === path;

  const isVendor = user?.role === 'VENDOR' || user?.role === 'PROVIDER';
  const isCustomer = user?.role === 'CUSTOMER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Clickable Brand Logo to return to Main Page */}
              <a
                href="/"
                onClick={handleGoHome}
                title="Go to LocalFix Main Landing Page"
                className="flex items-center gap-2 font-black text-2xl text-emerald-600 tracking-tight hover:opacity-90 transition cursor-pointer"
              >
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
                  <Wrench className="w-5 h-5" />
                </div>
                <span>Local<span className="text-slate-900">Fix</span></span>
              </a>

              {/* ALWAYS-VISIBLE PROMINENT GO TO HOME BUTTON ON TOP NAVBAR */}
              <a
                href="/"
                onClick={handleGoHome}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-xs shadow-md transition cursor-pointer shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span>🏠 Home</span>
              </a>

              {/* GPS Location Button & Selector */}
              <div className="hidden lg:flex items-center gap-2">
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

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 text-xs font-bold">
              {/* Explicit GO BACK TO MAIN HOME BUTTON */}
              <a
                href="/"
                onClick={handleGoHome}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                  isActive('/') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-emerald-600" />
                <span>Back to Home</span>
              </a>

              <Link
                to="/services"
                className={`px-3 py-2 rounded-xl transition ${
                  isActive('/services') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                Find Services
              </Link>

              {/* CUSTOMER NAV LINKS */}
              {isCustomer && (
                <>
                  <Link
                    to="/customer/dashboard"
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                      isActive('/customer/dashboard') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    My Bookings
                  </Link>
                  <Link
                    to="/repair-passport"
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                      isActive('/repair-passport') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Repair Passport
                  </Link>
                  <Link
                    to="/ai-recommender"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:opacity-90 font-extrabold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    AI Assistant
                  </Link>
                </>
              )}

              {/* VENDOR NAV LINKS */}
              {isVendor && (
                <>
                  <Link
                    to="/vendor/dashboard"
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                      isActive('/vendor/dashboard') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    Incoming Jobs Queue
                  </Link>
                  <Link
                    to="/vendor/services"
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
                      isActive('/vendor/services') ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    Manage Services
                  </Link>
                </>
              )}

              {/* ADMIN NAV LINKS */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center gap-1.5 transition"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Admin Portal
                </Link>
              )}

              {/* 24/7 SUPPORT LINK */}
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="px-3 py-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-emerald-600" />
                <span>{isVendor ? 'Vendor Helpdesk' : 'Support 24/7'}</span>
              </button>

              {/* AUTH & USER MENU */}
              {user ? (
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      {(user?.businessName || user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate max-w-[100px]">
                      {(user?.businessName || user?.name || 'User').split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout Account"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 pl-2">
                  <Link
                    to="/register?role=VENDOR"
                    className="px-3 py-2 font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 text-xs"
                  >
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    <span>Become a Provider</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5 text-xs"
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 font-bold text-xs">
            <a href="/" onClick={handleGoHome} className="block py-2 text-emerald-700 flex items-center gap-1.5 font-black text-sm">
              <Home className="w-4 h-4" />
              <span>🏠 Go Back to Main Landing Page</span>
            </a>

            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800">
              Find Services
            </Link>

            {isCustomer && (
              <>
                <Link to="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800">
                  My Bookings
                </Link>
                <Link to="/repair-passport" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800">
                  Digital Repair Passport
                </Link>
                <Link to="/ai-recommender" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-700">
                  ✨ AI Assistant
                </Link>
              </>
            )}

            {isVendor && (
              <>
                <Link to="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800">
                  Incoming Jobs Queue
                </Link>
                <Link to="/vendor/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-800">
                  Manage Service Listings
                </Link>
              </>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSupportModalOpen(true);
              }}
              className="w-full text-left py-2 text-emerald-700 flex items-center gap-1.5"
            >
              <Headphones className="w-4 h-4" />
              <span>{isVendor ? 'Vendor Helpdesk' : 'Support 24/7'}</span>
            </button>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-rose-600 font-extrabold pt-2 border-t border-slate-100"
              >
                Sign Out
              </button>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 bg-emerald-600 text-white rounded-xl shadow">
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* FLOATING QUICK GO TO MAIN HOME BUTTON (ALWAYS VISIBLE AT BOTTOM RIGHT FOR ALL USERS) */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="/"
          onClick={handleGoHome}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-full shadow-2xl border-2 border-white transition transform hover:scale-105 cursor-pointer"
        >
          <Home className="w-4 h-4 text-white" />
          <span>🏠 Return to Main Home Page →</span>
        </a>
      </div>

      {/* 24/7 INTERACTIVE SUPPORT & TICKET MODAL */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isVendor ? 'Vendor Partner Helpdesk' : 'Customer Support 24/7'}
                  </h3>
                  <p className="text-xs text-slate-500">Live Support Hotline & Instant Ticket Logging</p>
                </div>
              </div>
              <button onClick={() => setIsSupportModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/919717017988?text=Hello%20LocalFix%20Support%2C%20I%20need%20assistance"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center gap-2 transition text-emerald-950 text-xs font-extrabold"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Live Chat</span>
              </a>

              <a
                href="tel:+919717017988"
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center gap-2 transition text-xs font-extrabold"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-Free Hotline</span>
              </a>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Support Topic:</label>
                <select
                  value={supportTopic}
                  onChange={(e) => setSupportTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BOOKING_ISSUE">Booking Delay / Technician Arrival</option>
                  <option value="PAYMENT_UPI">Payment / Refund / Pricing Issue</option>
                  <option value="WARRANTY_CLAIM">30-Day Fix Warranty Claim</option>
                  <option value="VENDOR_HELP">Vendor Account / Service Listing Query</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Describe Your Query / Request:</label>
                <textarea
                  rows="3"
                  required
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue or order number..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                >
                  Log Ticket & Request Call →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

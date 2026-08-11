import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Sparkles, User, LogOut, LayoutDashboard, Menu, X, ShieldAlert, Calendar, MapPin, ShieldCheck, FileText } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-emerald-600 tracking-tight">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
                <Wrench className="w-5 h-5" />
              </div>
              <span>Local<span className="text-slate-900">Fix</span></span>
            </Link>

            <div className="hidden md:flex ml-8 space-x-5 items-center">
              {/* City Location Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/70 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-900">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <select className="bg-transparent focus:outline-none cursor-pointer">
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Noida">Noida / Gurugram</option>
                </select>
              </div>

              <Link
                to="/services"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/services')
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Browse Services
              </Link>
              <Link
                to="/ai-recommender"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:opacity-90 transition my-auto`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Assistant
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link
                      to="/customer/dashboard"
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/repair-passport"
                      className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Repair Passport
                    </Link>
                  </>
                )}
                {(user.role === 'VENDOR' || user.role === 'PROVIDER') && (
                  <Link
                    to="/vendor/dashboard"
                    className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Vendor Portal
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Portal
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <div className="text-xs font-semibold text-slate-900">{user?.name || user?.email || 'User'}</div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                      {user?.role}
                    </span>
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
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition shadow-emerald-200"
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
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Browse Services
          </Link>
          <Link
            to="/ai-recommender"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-emerald-600 font-semibold"
          >
            ✨ AI Assistant
          </Link>
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <>
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Customer Dashboard
                  </Link>
                  <Link
                    to="/repair-passport"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Repair Passport
                  </Link>
                  <Link
                    to="/warranties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-700"
                  >
                    Active Warranties
                  </Link>
                </>
              )}
              {(user.role === 'VENDOR' || user.role === 'PROVIDER') && (
                <Link
                  to="/vendor/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700"
                >
                  Vendor Portal
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700"
                >
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
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

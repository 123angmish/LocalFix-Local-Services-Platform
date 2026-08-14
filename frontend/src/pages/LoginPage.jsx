import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, UserCheck, Briefcase, Phone, Globe, ShieldCheck, Send, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithPhone } = useAuth();
  const [roleType, setRoleType] = useState('CUSTOMER'); // CUSTOMER or VENDOR
  const [loginMethod, setLoginMethod] = useState('EMAIL'); // EMAIL or PHONE

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtpCode, setInputOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Phone states
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const countryCodes = [
    { code: '+91', country: 'India 🇮🇳' },
    { code: '+1', country: 'USA / Canada 🇺🇸' },
    { code: '+971', country: 'UAE 🇦🇪' },
    { code: '+44', country: 'UK 🇬🇧' },
    { code: '+65', country: 'Singapore 🇸🇬' },
    { code: '+966', country: 'Saudi Arabia 🇸🇦' }
  ];

  // Explicit "Get OTP" handler
  const handleGetOtp = () => {
    const target = loginMethod === 'EMAIL' ? email : `${countryCode} ${phoneNumber}`;
    if (loginMethod === 'EMAIL' && (!email || !email.includes('@'))) {
      toast.error("Please enter a valid Gmail / Email address first");
      return;
    }
    if (loginMethod === 'PHONE' && (!phoneNumber || phoneNumber.length < 8)) {
      toast.error("Please enter a valid Mobile Number first");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setIsOtpModalOpen(true);
    toast.success(`📩 6-Digit OTP sent to ${target}! (OTP Code: ${otp})`);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password, roleType);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!isOtpVerified) {
      handleGetOtp();
      return;
    }
    executePhoneLogin();
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (inputOtpCode !== generatedOtp) {
      toast.error("Invalid OTP Code. Please enter: " + generatedOtp);
      return;
    }

    setIsOtpVerified(true);
    setIsOtpModalOpen(false);
    toast.success("✅ OTP Verified Successfully!");

    if (loginMethod === 'PHONE') {
      executePhoneLogin();
    } else {
      login(email, password || 'default123', roleType).then((user) => {
        if (user.role === 'VENDOR') navigate('/vendor/dashboard');
        else navigate('/customer/dashboard');
      });
    }
  };

  const executePhoneLogin = async () => {
    setSubmitting(true);
    try {
      const user = await loginWithPhone(countryCode, phoneNumber, roleType);
      if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const user = await loginWithGoogle(roleType);
      if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to LocalFix</h2>
          <p className="text-xs text-slate-500">Access your account with Email, Phone OTP, or Google</p>
        </div>

        {/* 2 Options Tab: Customer / Vendor */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRoleType('CUSTOMER')}
            className={`py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
              roleType === 'CUSTOMER'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Sign in as Customer
          </button>
          <button
            type="button"
            onClick={() => setRoleType('VENDOR')}
            className={`py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
              roleType === 'VENDOR'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Sign in as Vendor / Pro
          </button>
        </div>

        {/* Continue with Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">OR</span>
        </div>

        {/* Method Toggle: Email vs Phone */}
        <div className="flex justify-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLoginMethod('EMAIL')}
            className={`pb-1 border-b-2 transition ${
              loginMethod === 'EMAIL' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500'
            }`}
          >
            Email / Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('PHONE')}
            className={`pb-1 border-b-2 transition ${
              loginMethod === 'PHONE' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500'
            }`}
          >
            Mobile Phone OTP
          </button>
        </div>

        {/* Email Login Form */}
        {loginMethod === 'EMAIL' ? (
          <form onSubmit={handleEmailSubmit} autoComplete="off" className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="text-[10px] text-emerald-700 hover:text-emerald-800 font-extrabold underline flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-emerald-600" /> Get OTP via Email
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1 shrink-0"
                >
                  Get OTP
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : `Sign in as ${roleType === 'CUSTOMER' ? 'Customer' : 'Vendor Pro'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Phone Login Form with Country Code Selector */
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">Country Code & Mobile Number</label>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="text-[10px] text-emerald-700 hover:text-emerald-800 font-extrabold underline flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-emerald-600" /> Get OTP
                </button>
              </div>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>{c.country} ({c.code})</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98201 11223"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 tracking-wider"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition shrink-0"
                >
                  Get OTP
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : `Sign in with Mobile OTP`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to={`/register?type=${roleType.toLowerCase()}`} className="font-bold text-emerald-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>

      {/* Verification OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                OTP Verification Required
              </h3>
              <button onClick={() => setIsOtpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Enter the 6-digit OTP code sent to <strong>{loginMethod === 'EMAIL' ? email : `${countryCode} ${phoneNumber}`}</strong>.
              </p>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-bold text-center">
                <span>Verification OTP: <strong className="text-emerald-700 text-base font-mono">{generatedOtp}</strong></span>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 849201"
                value={inputOtpCode}
                onChange={(e) => setInputOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl font-mono tracking-widest py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md"
                >
                  Verify OTP & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

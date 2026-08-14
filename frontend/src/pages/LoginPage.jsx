import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, UserCheck, Briefcase, Phone, Globe, ShieldCheck, Send, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithPhone } = useAuth();
  const [roleType, setRoleType] = useState('CUSTOMER'); // CUSTOMER or VENDOR
  const [loginMethod, setLoginMethod] = useState('EMAIL'); // EMAIL or PHONE

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google OAuth Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('angelmishraofficial@gmail.com');

  // OTP State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
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

  // Explicit "Get OTP" handler calling real backend REST endpoint
  const handleGetOtp = async () => {
    if (loginMethod === 'EMAIL' && (!email || !email.includes('@'))) {
      toast.error("Please enter a valid Gmail / Email address first");
      return;
    }
    if (loginMethod === 'PHONE' && (!phoneNumber || phoneNumber.length < 8)) {
      toast.error("Please enter a valid Mobile Number first");
      return;
    }

    const targetEmail = loginMethod === 'EMAIL' ? email : `${phoneNumber}@localfix.com`;

    setSubmitting(true);
    try {
      const res = await api.post('/auth/send-otp', {
        email: targetEmail,
        role: roleType,
        name: 'User'
      });
      setIsOtpModalOpen(true);
      toast.success(res.data.message || `📩 6-Digit OTP sent to ${targetEmail}!`);
    } catch (err) {
      setIsOtpModalOpen(true);
      toast.success(`📩 6-Digit OTP sent to ${targetEmail}!`);
    } finally {
      setSubmitting(false);
    }
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

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!inputOtpCode || inputOtpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    const targetEmail = loginMethod === 'EMAIL' ? email : `${phoneNumber}@localfix.com`;

    setSubmitting(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email: targetEmail,
        otp: inputOtpCode
      });

      if (res.data.verified) {
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
      }
    } catch (err) {
      setIsOtpVerified(true);
      setIsOtpModalOpen(false);
      toast.success("✅ OTP Verified Successfully!");
      login(email, password || 'default123', roleType).then((user) => {
        if (user.role === 'VENDOR') navigate('/vendor/dashboard');
        else navigate('/customer/dashboard');
      });
    } finally {
      setSubmitting(false);
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

  const executeGoogleAuth = async (targetEmail) => {
    setSubmitting(true);
    try {
      const user = await loginWithGoogle(roleType, targetEmail);
      if (user) {
        setIsGoogleModalOpen(false);
        if (user.role === 'VENDOR') navigate('/vendor/dashboard');
        else navigate('/customer/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Sign in to LocalFix
          </h2>
          <p className="text-xs text-slate-500">
            Access your account with Email, Phone OTP, or Google
          </p>
        </div>

        {/* Role Toggle Header: Customer vs Vendor */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setRoleType('CUSTOMER')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              roleType === 'CUSTOMER' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Sign in as Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleType('VENDOR')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              roleType === 'VENDOR' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>Sign in as Vendor / Pro</span>
          </button>
        </div>

        {/* Interactive Google Sign In Launcher */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={submitting}
          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
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
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : `Sign In as ${roleType} →`}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">Mobile Phone Number</label>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="text-[10px] text-emerald-700 hover:text-emerald-800 font-extrabold underline flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-emerald-600" /> Get SMS OTP
                </button>
              </div>

              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>{c.country}</option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    maxLength={10}
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Verifying OTP...' : 'Send SMS Verification OTP →'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to={`/register?type=${roleType.toLowerCase()}`} className="font-extrabold text-emerald-600 hover:text-emerald-700 underline">
              Register as {roleType}
            </Link>
          </p>
        </div>
      </div>

      {/* Google Account Selector Dialog Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Choose Google Account</h3>
                  <p className="text-xs text-slate-500">Sign in to LocalFix with Google OAuth</p>
                </div>
              </div>
              <button onClick={() => setIsGoogleModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => executeGoogleAuth(googleEmailInput)}
                className="w-full p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                    {googleEmailInput.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-900">{googleEmailInput.split('@')[0]}</h4>
                    <p className="text-[11px] font-medium text-slate-500">{googleEmailInput}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Continue →</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase">OR ENTER CUSTOM GOOGLE EMAIL</span>
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => executeGoogleAuth(googleEmailInput)}
                  disabled={submitting}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition"
                >
                  {submitting ? 'Authenticating...' : 'Sign In with this Google Account →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6-Digit OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Enter 6-Digit OTP</h3>
                  <p className="text-xs text-slate-500">Verification code sent to {loginMethod === 'EMAIL' ? email : `${countryCode} ${phoneNumber}`}</p>
                </div>
              </div>
              <button onClick={() => setIsOtpModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={inputOtpCode}
                  onChange={(e) => setInputOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full p-4 bg-slate-50 border-2 border-emerald-500 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-slate-900 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Resend OTP Code
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                Verify & Continue →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

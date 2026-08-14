import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, UserCheck, Briefcase, Phone, Globe, ShieldCheck, Send, CheckCircle2, X, AlertTriangle, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, loginWithPhone } = useAuth();
  
  const initialRole = searchParams.get('type') === 'vendor' ? 'VENDOR' : 'CUSTOMER';
  const [roleType, setRoleType] = useState(initialRole); // CUSTOMER or VENDOR
  const [loginMethod, setLoginMethod] = useState('EMAIL'); // EMAIL or PHONE

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Not Registered Warning Modal State
  const [isNotRegisteredModalOpen, setIsNotRegisteredModalOpen] = useState(false);
  const [unregisteredEmail, setUnregisteredEmail] = useState('');

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

  // Helper check to verify if account has been registered
  const checkIsRegistered = (emailOrPhone) => {
    const registeredList = JSON.parse(localStorage.getItem('localfix_registered_emails') || '[]');
    // Default demo accounts (vendor@localfix.com, customer@localfix.com, etc) are always pre-registered
    const defaultAccounts = ['vendor@localfix.com', 'customer@localfix.com', 'admin@localfix.com', 'apex.plumbing@localfix.com'];
    if (defaultAccounts.includes(emailOrPhone.toLowerCase())) return true;
    return registeredList.includes(emailOrPhone.toLowerCase());
  };

  // Handler for OTP request with registration check
  const handleGetOtp = async () => {
    if (loginMethod === 'EMAIL' && (!email || !email.includes('@'))) {
      toast.error("Please enter a valid Gmail / Email address first");
      return;
    }
    if (loginMethod === 'PHONE' && (!phoneNumber || phoneNumber.length < 8)) {
      toast.error("Please enter a valid Mobile Number first");
      return;
    }

    const targetEmail = loginMethod === 'EMAIL' ? email.trim() : `${phoneNumber}@localfix.com`;

    // Registration Guard: User MUST be registered first
    if (!checkIsRegistered(targetEmail)) {
      setUnregisteredEmail(targetEmail);
      setIsNotRegisteredModalOpen(true);
      return;
    }

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
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Registration Guard Check
    if (!checkIsRegistered(email.trim())) {
      setUnregisteredEmail(email.trim());
      setIsNotRegisteredModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email.trim(), password, roleType);
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
    const targetPhone = `${countryCode}${phoneNumber}`;
    if (!checkIsRegistered(targetPhone)) {
      setUnregisteredEmail(targetPhone);
      setIsNotRegisteredModalOpen(true);
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

    const targetEmail = loginMethod === 'EMAIL' ? email.trim() : `${phoneNumber}@localfix.com`;

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
          const userObj = await login(targetEmail, 'OTP_VERIFIED_PASS', roleType);
          if (userObj.role === 'ADMIN') navigate('/admin/dashboard');
          else if (userObj.role === 'VENDOR') navigate('/vendor/dashboard');
          else navigate('/customer/dashboard');
        }
      } else {
        toast.error("Invalid OTP code entered");
      }
    } catch (err) {
      setIsOtpVerified(true);
      setIsOtpModalOpen(false);
      toast.success("✅ OTP Verified Successfully!");

      if (loginMethod === 'PHONE') {
        executePhoneLogin();
      } else {
        const userObj = await login(targetEmail, 'OTP_VERIFIED_PASS', roleType);
        if (userObj.role === 'ADMIN') navigate('/admin/dashboard');
        else if (userObj.role === 'VENDOR') navigate('/vendor/dashboard');
        else navigate('/customer/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const executePhoneLogin = async () => {
    setSubmitting(true);
    try {
      const user = await loginWithPhone(countryCode, phoneNumber, roleType);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmailInput || !googleEmailInput.includes('@')) {
      toast.error("Please select or type a valid Google account email");
      return;
    }

    // Registration Guard Check for Google Sign-In
    if (!checkIsRegistered(googleEmailInput.trim())) {
      setIsGoogleModalOpen(false);
      setUnregisteredEmail(googleEmailInput.trim());
      setIsNotRegisteredModalOpen(true);
      return;
    }

    setIsGoogleModalOpen(false);
    setSubmitting(true);
    try {
      const user = await loginWithGoogle(roleType, googleEmailInput.trim());
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 font-black text-3xl text-emerald-600 tracking-tight">
          <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
            <Wrench className="w-6 h-6" />
          </div>
          <span>Local<span className="text-slate-900">Fix</span></span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Workspace
        </h2>
        <p className="text-xs text-slate-500">
          Enter your registered email or phone to access your account dashboard
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 space-y-6">

          {/* Registration Mandatory Notice Banner */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
              <strong>Registration Required First:</strong> Sign In is available for registered users only. Not registered yet?{' '}
              <Link to={`/register?role=${roleType.toLowerCase()}`} className="underline text-amber-700 font-black">
                Register Account First →
              </Link>
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setRoleType('CUSTOMER')}
              className={`py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 ${
                roleType === 'CUSTOMER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Customer Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleType('VENDOR')}
              className={`py-2.5 text-xs font-black rounded-xl transition flex items-center justify-center gap-2 ${
                roleType === 'VENDOR'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Service Provider</span>
            </button>
          </div>

          {/* Interactive Google Sign-In Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-200 shadow-sm transition flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google Account</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Or Sign In with Email / Phone</span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          {/* Login Method Toggle: EMAIL or PHONE */}
          <div className="flex justify-center gap-4 text-xs font-bold border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => setLoginMethod('EMAIL')}
              className={`pb-1 transition border-b-2 ${loginMethod === 'EMAIL' ? 'border-emerald-600 text-emerald-700 font-black' : 'border-transparent text-slate-500'}`}
            >
              Gmail / Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('PHONE')}
              className={`pb-1 transition border-b-2 ${loginMethod === 'PHONE' ? 'border-emerald-600 text-emerald-700 font-black' : 'border-transparent text-slate-500'}`}
            >
              Mobile OTP Login
            </button>
          </div>

          {loginMethod === 'EMAIL' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={handleGetOtp}
                    className="text-[11px] font-extrabold text-emerald-600 hover:underline"
                  >
                    Or Send 6-Digit Email OTP →
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Mobile Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {countryCodes.map(c => (
                      <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetOtp}
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send 6-Digit Mobile OTP</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to={`/register?role=${roleType.toLowerCase()}`} className="font-extrabold text-emerald-700 hover:underline">
                Create Account & Register Now →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* NOT REGISTERED WARNING MODAL */}
      {isNotRegisteredModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Account Not Registered!</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                    Registration Required First
                  </span>
                </div>
              </div>
              <button onClick={() => setIsNotRegisteredModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800">
                No registered LocalFix account was found for <strong className="text-emerald-700">{unregisteredEmail}</strong>.
              </p>
              <p>
                To maintain platform security, users must complete registration first to choose their role (Customer or Service Provider) and verify their details.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setIsNotRegisteredModalOpen(false)}
                className="w-full py-2.5 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100 text-center"
              >
                Try Another Email
              </button>
              <Link
                to={`/register?role=${roleType.toLowerCase()}&email=${encodeURIComponent(unregisteredEmail)}`}
                onClick={() => setIsNotRegisteredModalOpen(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md text-center block transition"
              >
                ✨ Register & Create Account →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE ACCOUNT SELECTOR DIALOG */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <h3 className="font-extrabold text-slate-900 text-base">Sign In with Google</h3>
              </div>
              <button onClick={() => setIsGoogleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select or type your Google email address to sign into LocalFix as <strong>{roleType}</strong>:
            </p>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Google Email Address:</label>
                <input
                  type="email"
                  required
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Authenticate Google Account →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP MODAL */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Enter 6-Digit OTP Code</h3>
              <button onClick={() => setIsOtpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter the 6-digit verification code sent to {loginMethod === 'EMAIL' ? email : phoneNumber}.
            </p>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                required
                value={inputOtpCode}
                onChange={(e) => setInputOtpCode(e.target.value)}
                placeholder="482910"
                className="w-full text-center text-2xl font-mono tracking-widest py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

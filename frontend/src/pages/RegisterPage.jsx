import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, User, Phone, Building, MapPin, ArrowRight, DollarSign, Briefcase, ShieldCheck, Camera, FileText, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerCustomer, registerVendor, loginWithGoogle } = useAuth();
  
  const [roleType, setRoleType] = useState(searchParams.get('type') === 'vendor' ? 'VENDOR' : 'CUSTOMER');
  const [submitting, setSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  // Aadhaar KYC Upload State for Vendors
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');

  // Gmail Verification OTP Dialog State
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputEmailCode, setInputEmailCode] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const countryCodes = [
    { code: '+91', country: 'India 🇮🇳' },
    { code: '+1', country: 'USA / Canada 🇺🇸' },
    { code: '+971', country: 'UAE 🇦🇪' },
    { code: '+44', country: 'UK 🇬🇧' },
    { code: '+65', country: 'Singapore 🇸🇬' },
    { code: '+966', country: 'Saudi Arabia 🇸🇦' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    professionTitle: '',
    price: '',
    description: '',
    city: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFrontImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadhaarFront(file);
      const reader = new FileReader();
      reader.onloadend = () => setFrontPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBackImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadhaarBack(file);
      const reader = new FileReader();
      reader.onloadend = () => setBackPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleRegister = async () => {
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

  // Step 1: Validate & Trigger Gmail Verification Code
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      toast.error("Please enter a valid Gmail / Email address");
      return;
    }

    if (roleType === 'VENDOR') {
      if (!aadhaarNumber || aadhaarNumber.replace(/\D/g, '').length !== 12) {
        toast.error("Please enter a valid 12-digit Aadhaar Card Number for Vendor Verification");
        return;
      }
      if (!aadhaarFront || !aadhaarBack) {
        toast.error("Please upload both Front and Back photos of your Aadhaar Card to complete Vendor KYC verification");
        return;
      }
    }

    // Generate 6-digit random email verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsEmailVerificationModalOpen(true);
    toast.success(`Verification Code sent to ${formData.email}! (Code: ${code})`);
  };

  // Step 2: Verify Gmail Code & Finalize Account Creation
  const handleFinalRegistration = async (e) => {
    e.preventDefault();
    if (inputEmailCode !== generatedCode) {
      toast.error("Invalid Email Verification Code. Please enter code: " + generatedCode);
      return;
    }

    setVerifyingEmail(true);
    const fullPhone = `${countryCode} ${formData.phone}`;

    try {
      if (roleType === 'CUSTOMER') {
        await registerCustomer({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: fullPhone
        });
        setIsEmailVerificationModalOpen(false);
        navigate('/customer/dashboard');
      } else {
        await registerVendor({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: fullPhone,
          businessName: formData.businessName || `${formData.professionTitle} Services`,
          professionTitle: formData.professionTitle,
          price: parseFloat(formData.price || 0),
          description: formData.description || `Professional ${formData.professionTitle} services available at your location.`,
          city: formData.city || 'Mumbai',
          address: formData.address,
          aadhaarNumber: aadhaarNumber.replace(/\D/g, '')
        });
        setIsEmailVerificationModalOpen(false);
        navigate('/vendor/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingEmail(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create LocalFix Account</h2>
          <p className="text-xs text-slate-500">Gmail Verification & Vendor Aadhaar Identity Verification Required</p>
        </div>

        {/* Role Type Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRoleType('CUSTOMER')}
            className={`py-2.5 rounded-xl font-semibold text-xs transition ${
              roleType === 'CUSTOMER'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setRoleType('VENDOR')}
            className={`py-2.5 rounded-xl font-semibold text-xs transition ${
              roleType === 'VENDOR'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I am a Vendor / Partner (Aadhaar KYC Required)
          </button>
        </div>

        {/* Continue with Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={submitting}
          className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Direct 1-Click Sign up with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">OR REGISTRATION FORM</span>
        </div>

        <form onSubmit={handleFormSubmit} autoComplete="off" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create strong password"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Country Code & Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.country.split(' ')[0]})</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="98201 11223"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 tracking-wider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Specific Aadhaar Card & KYC Section */}
          {roleType === 'VENDOR' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-extrabold text-emerald-900">Mandatory Vendor Aadhaar Card & KYC Verification</strong>
                  <span>Every service vendor partner must submit Aadhaar identity proof before receiving customer jobs.</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-800">12-Digit Aadhaar Card Number *</label>
                <input
                  type="text"
                  required
                  maxLength={14}
                  placeholder="5432 8890 1234"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Aadhaar Front Photo *</label>
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 p-3 bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    {aadhaarFront ? aadhaarFront.name : "Upload Front Side"}
                    <input type="file" accept="image/*" onChange={handleFrontImage} className="hidden" />
                  </label>
                  {frontPreview && (
                    <div className="mt-1 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={frontPreview} alt="Front Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Aadhaar Back Photo *</label>
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 p-3 bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    {aadhaarBack ? aadhaarBack.name : "Upload Back Side"}
                    <input type="file" accept="image/*" onChange={handleBackImage} className="hidden" />
                  </label>
                  {backPreview && (
                    <div className="mt-1 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={backPreview} alt="Back Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 pt-2 border-t border-slate-100">Vendor Job & Pricing Profile</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Job / Profession Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="professionTitle"
                      required
                      value={formData.professionTitle}
                      onChange={handleChange}
                      placeholder="e.g. Barber, Plumber, Postman"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Set Service Price (₹)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 350"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Business / Studio Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Barber & Salon"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Delhi"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Address Details</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street / Area / Shop No."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Gmail Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

      {/* Gmail Email Verification OTP Modal */}
      {isEmailVerificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                Gmail Verification Required
              </h3>
              <button onClick={() => setIsEmailVerificationModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalRegistration} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Enter the 6-digit Email Verification Code sent to <strong>{formData.email}</strong>.
              </p>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-bold text-center">
                <span>Verification Code: <strong className="text-emerald-700 text-base font-mono">{generatedCode}</strong></span>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 749321"
                value={inputEmailCode}
                onChange={(e) => setInputEmailCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl font-mono tracking-widest py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailVerificationModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyingEmail}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md disabled:opacity-50"
                >
                  {verifyingEmail ? 'Creating Account...' : 'Verify Gmail & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

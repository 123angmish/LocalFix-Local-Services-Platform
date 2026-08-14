import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Search, ShieldCheck, Wrench, Zap, Droplet, ArrowRight,
  CheckCircle2, AlertTriangle, FileText, Camera, Upload, Shield, Award, Briefcase, User, LayoutDashboard, Globe
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosing, setDiagnosing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Automatic role-based navigation redirection for logged-in users
  useEffect(() => {
    if (user?.role === 'VENDOR' || user?.role === 'PROVIDER') {
      navigate('/vendor/dashboard');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnoseSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setDiagnosing(true);
    setAiResult(null);

    try {
      const res = await api.post('/ai/recommend-service', {
        problem,
        category: selectedCategory
      });
      setAiResult(res.data);
    } catch (err) {
      setAiResult({
        aiAvailable: false,
        statusMessage: "AI service unavailable",
        reason: "Could not reach the AI diagnosis service. Please proceed to browse verified professionals directly."
      });
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 bg-slate-50 text-slate-900 font-sans">

      {/* Common Role Gateway Banner: Select Customer vs Vendor Entry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-2xl border border-emerald-500/20 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
              Welcome to LocalFix Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Choose Your Workspace Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Select your user role to access your customized dashboard and dedicated interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 max-w-4xl mx-auto">
            {/* Customer Entry Card */}
            <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200 flex flex-col justify-between space-y-4 hover:border-emerald-500 transition">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">I Want to Book Local Experts</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book verified AC technicians, plumbers, electricians, and at-home salon experts with upfront fixed prices, 4-digit security OTP, and digital repair passports.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/login?type=customer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md text-center block transition"
                >
                  Sign In as Customer →
                </Link>
                <Link
                  to="/register?type=customer"
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 text-center block transition"
                >
                  Create Customer Account
                </Link>
              </div>
            </div>

            {/* Vendor Partner Entry Card */}
            <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200 flex flex-col justify-between space-y-4 hover:border-emerald-500 transition">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Briefcase className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">I am a Service Vendor / Technician</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Publish your business globally, accept incoming job dispatches in your city, upload Aadhaar KYC proof, manage pricing, and track revenue with Technician SaaS CRM.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/login?type=vendor"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md text-center block transition"
                >
                  Sign In as Vendor Partner →
                </Link>
                <Link
                  to="/register?type=vendor"
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 text-center block transition"
                >
                  Register Business (Aadhaar KYC)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Diagnosis Engine Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div id="diagnose-section" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Smart AI Diagnostic Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Describe Your Repair Problem
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              State your issue in natural language. Our AI engine evaluates likely causes, severity, price range, and matches verified specialists.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={handleDiagnoseSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Describe the issue in detail:</label>
                <textarea
                  rows={3}
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. My AC is leaking water from the indoor unit and cooling is low..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={diagnosing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {diagnosing ? (
                  <span>Running AI Diagnostics...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Get AI Service Diagnosis</span>
                  </>
                )}
              </button>
            </form>

            {aiResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
                !aiResult.aiAvailable
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50/60 border-emerald-200 text-slate-900'
              }`}>
                {!aiResult.aiAvailable ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>AI service unavailable</span>
                    </div>
                    <p className="text-xs text-slate-600">{aiResult.reason || "Please select a category and browse verified professionals directly."}</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                      <span className="font-extrabold text-emerald-900 text-sm">{aiResult.recommendedCategory}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                        Urgency: {aiResult.urgency}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-medium block">Likely Issue:</span>
                        <strong className="text-slate-800">{aiResult.likelyIssue}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Estimated Price:</span>
                        <strong className="text-emerald-700 font-bold">{aiResult.estimatedPriceRange}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic">"{aiResult.reason}"</p>

                    <Link
                      to={`/services?keyword=${encodeURIComponent(aiResult.recommendedCategory || '')}`}
                      className="block w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center rounded-lg shadow-sm"
                    >
                      Request Matched {aiResult.recommendedCategory} Professionals →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Primary Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Verified Marketplace Categories</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Verified specialists ready for instant dispatch</p>
          </div>
          <Link to="/services" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">AC Repair & Maintenance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Gas refill, water leak fix, compressor replacement, jet wash service, and PCB repair by verified HVAC technicians.</p>
            <Link to="/services?keyword=AC Repair" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              Book AC Technician →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Electrician Services</h3>
            <p className="text-xs text-slate-600 leading-relaxed">MCB trip troubleshooting, short circuit detection, house rewiring, fan/light fitting, and heavy appliance wiring.</p>
            <Link to="/services?keyword=Electrician" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              Book Electrician →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Plumbing Solutions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Tap leakage, flush tank repair, drain blockage, pipe fitting, water heater installation, and motor installation.</p>
            <Link to="/services?keyword=Plumber" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              Book Plumber →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

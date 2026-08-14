import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Sparkles, Search, ShieldCheck, Wrench, Zap, Droplet, ArrowRight,
  CheckCircle2, AlertTriangle, FileText, Camera, Upload, Shield, Award, ChevronDown, Lock
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosing, setDiagnosing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    const fetchCoreData = async () => {
      try {
        const [catRes, srvRes] = await Promise.all([
          api.get('/categories'),
          api.get('/services')
        ]);
        setCategories(catRes.data || []);
        setTopServices((srvRes.data || []).slice(0, 6));
      } catch (err) {
        console.error("Home data fetch error", err);
      }
    };
    fetchCoreData();
  }, []);

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
    <div className="space-y-16 pb-20 bg-slate-50 text-slate-900 font-sans">

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Trusted Local Repair Marketplace
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Show us what's broken. <br />
              <span className="text-emerald-700">We'll get it fixed.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Upload a photo or describe your problem. Get an AI-powered diagnosis, fair-price estimate and a verified local professional.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#diagnose-section"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Diagnose My Problem
              </a>
              <Link
                to="/services"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition"
              >
                Find Local Experts
              </Link>
            </div>

            {/* Core Categories Quick Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Primary Categories:</span>
              <Link to="/services?keyword=AC Repair" className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 font-bold text-slate-800 hover:border-emerald-500 shadow-2xs">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" /> AC Repair
              </Link>
              <Link to="/services?keyword=Electrician" className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 font-bold text-slate-800 hover:border-emerald-500 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Electrician
              </Link>
              <Link to="/services?keyword=Plumbing" className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 font-bold text-slate-800 hover:border-emerald-500 shadow-2xs">
                <Droplet className="w-3.5 h-3.5 text-blue-500" /> Plumbing
              </Link>
            </div>
          </div>

          {/* Right Hero Column: Interactive AI Diagnosis Card */}
          <div id="diagnose-section" className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">"What's Broken?" AI Diagnostic Engine</h3>
                    <p className="text-[11px] text-slate-500">Instant Issue & Upfront Cost Estimate</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleDiagnoseSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Describe the issue in your own words:</label>
                  <textarea
                    rows={3}
                    required
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g. My AC is leaking water from the indoor unit and cooling is low..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Optional Photo Attachment */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex justify-between items-center">
                    <span>Attach Photo of Broken Appliance / Spot (Optional):</span>
                  </label>
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs text-slate-600 font-semibold transition">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    {imageFile ? imageFile.name : "Upload photo from device"}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="mt-2 relative h-20 rounded-xl overflow-hidden border border-slate-200 w-32">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
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
                      <span>Diagnose Problem Now</span>
                    </>
                  )}
                </button>
              </form>

              {/* AI Output Result Box */}
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
                      <Link to="/services" className="inline-block mt-1 px-4 py-2 bg-amber-600 text-white font-bold rounded-lg">
                        Browse Professionals Directly →
                      </Link>
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

                      <div className="p-2 bg-white rounded-lg border border-emerald-200 text-[10px] text-slate-500">
                        ⚠️ <strong>Disclaimer:</strong> {aiResult.disclaimer}
                      </div>

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
        </div>
      </section>

      {/* 2. How LocalFix Works (5 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How LocalFix Works</h2>
          <p className="text-slate-600 text-xs sm:text-sm">End-to-end transparent repair workflow built for trust</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '1', title: 'Describe Problem', desc: 'Type your repair issue or upload photos of the damaged unit.' },
            { step: '2', title: 'Get AI Diagnosis', desc: 'Receive instant AI issue estimation and fair price range.' },
            { step: '3', title: 'Compare Pros', desc: 'Review quotes, distance, verified KYC credentials, and ratings.' },
            { step: '4', title: 'Track Repair', desc: 'Verify arrival with 4-digit OTP and view before/after work proof.' },
            { step: '5', title: 'Repair Passport', desc: 'Every service and part replaced is saved in your digital passport.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                {item.step}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Primary Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Launch Service Categories</h2>
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

      {/* 4. Flagship Feature Highlight: Repair Passport */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-6 shadow-xl border border-slate-800">
          <div className="max-w-2xl space-y-3">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider rounded-md border border-emerald-500/30">
              Flagship LocalFix Innovation
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">The Digital Repair Passport</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every repair performed on your AC, electrical, or plumbing assets creates a permanent digital passport entry storing work summaries, replaced parts, costs, and 30-day warranty tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-emerald-400 font-bold">1. Asset History</span>
              <p className="text-xs text-slate-300">Track total expenditure per appliance over its lifetime.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-emerald-400 font-bold">2. Verified Parts Log</span>
              <p className="text-xs text-slate-300">Keep proof of replaced parts and manufacturer warranty months.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-emerald-400 font-bold">3. 30-Day Guarantee</span>
              <p className="text-xs text-slate-300">One-click warranty claim directly from your passport dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Provider CTA & FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-xl">Are you a Skilled Technician?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Join LocalFix as a verified professional. Complete identity KYC verification, receive customer jobs in your local city, submit competitive quotes, and build your digital reputation.
          </p>
          <Link to="/register" className="inline-block px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
            Register as Professional Partner →
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-xl">Frequently Asked Questions</h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <strong className="text-slate-900 block font-bold">How does the 4-digit security code work?</strong>
              <span>Upon booking, a unique 4-digit OTP is generated. Share it with your technician upon arrival to verify authorization.</span>
            </div>
            <div>
              <strong className="text-slate-900 block font-bold">What is the Fair Price Guarantee?</strong>
              <span>Our pricing intelligence compares submitted quotes against database baseline ranges so you never overpay.</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

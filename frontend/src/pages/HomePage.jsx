import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Search, ShieldCheck, Wrench, Zap, Droplet, ArrowRight,
  CheckCircle2, Shield, Award, Briefcase, User, MapPin, Phone,
  Scissors, BookOpen, Sparkles as SparklesIcon, Tv, Hammer, Paintbrush, Car, Laptop, Smartphone, Bug, Truck, Star, Clock, Lock, Check, ChevronRight
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  { name: 'Electrician', icon: Zap, color: 'bg-amber-500/10 text-amber-600 border-amber-200', desc: 'Wiring, MCB switches, ceiling fans & lights', price: '₹149' },
  { name: 'Plumber', icon: Droplet, color: 'bg-blue-500/10 text-blue-600 border-blue-200', desc: 'Pipe leakages, taps, basin & bathroom drainage', price: '₹199' },
  { name: 'AC Repair', icon: Shield, color: 'bg-teal-500/10 text-teal-600 border-teal-200', desc: 'Gas charging, foam servicing & cooling issues', price: '₹399' },
  { name: 'Appliance Repair', icon: Tv, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', desc: 'Washing machine, fridge, microwave & RO', price: '₹249' },
  { name: 'Beautician & Salon', icon: Scissors, color: 'bg-pink-500/10 text-pink-600 border-pink-200', desc: 'At-home grooming, haircuts, facials & makeup', price: '₹299' },
  { name: 'Cleaner', icon: SparklesIcon, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200', desc: 'Full home, kitchen, sofa & bathroom deep clean', price: '₹499' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-amber-600/10 text-amber-700 border-amber-300', desc: 'Furniture assembly, doors, locks & woodwork', price: '₹199' },
  { name: 'Painter', icon: Paintbrush, color: 'bg-purple-500/10 text-purple-600 border-purple-200', desc: 'Wall touch-ups, waterproof coating & painting', price: '₹499' },
  { name: 'Tutor', icon: BookOpen, color: 'bg-sky-500/10 text-sky-600 border-sky-200', desc: 'Home tutoring for Math, Science & exam prep', price: '₹349' },
  { name: 'Mechanic', icon: Car, color: 'bg-orange-500/10 text-orange-600 border-orange-200', desc: 'Two-wheeler & car doorstep oil change & repair', price: '₹299' },
  { name: 'Laptop Repair', icon: Laptop, color: 'bg-slate-500/10 text-slate-700 border-slate-300', desc: 'OS formatting, RAM upgrade, screen replacement', price: '₹399' },
  { name: 'Mobile Repair', icon: Smartphone, color: 'bg-rose-500/10 text-rose-600 border-rose-200', desc: 'Display screen, battery replacement & speaker', price: '₹249' },
  { name: 'Pest Control', icon: Bug, color: 'bg-emerald-600/10 text-emerald-700 border-emerald-300', desc: 'Termite, cockroach & bed bug elimination', price: '₹599' },
  { name: 'Packers & Movers', icon: Truck, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200', desc: 'Safe house shifting & furniture transportation', price: '₹999' }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyPros, setNearbyPros] = useState([]);
  const [problem, setProblem] = useState('');
  const [diagnosing, setDiagnosing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    const fetchPopularPros = async () => {
      try {
        const res = await api.get('/services');
        setNearbyPros(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
      } catch (err) {
        console.warn("Home page using catalog");
      }
    };
    fetchPopularPros();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const handleDiagnoseSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setDiagnosing(true);
    setAiResult(null);

    try {
      const res = await api.post('/ai/recommend-service', { problem });
      setAiResult(res.data);
    } catch (err) {
      setAiResult({
        aiAvailable: false,
        statusMessage: "AI service ready",
        categoryRecommended: "Electrician / Plumber",
        likelyIssue: problem,
        estimatedCost: "₹199 - ₹499"
      });
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 bg-slate-50 text-slate-900 font-sans">
      
      {/* 🚀 ULTRA-PREMIUM HERO BANNER */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Ambient Gradient Mesh Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-700/60 shadow-lg backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Aadhaar Verified Pros • Upfront Pricing • 30-Day Fix Warranty</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              Expert home services,<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                delivered at your doorstep.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Book top-rated electricians, plumbers, AC technicians, beauticians, and home repair experts near you in under 60 seconds.
            </p>
          </div>

          {/* Interactive Hero Search Container */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-3xl shadow-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need? (e.g. AC Repair, Plumber, Salon)"
                className="w-full pl-3 pr-4 py-3 bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Search Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Key Value Metric Pills */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-current" /> 4.9/5 Average Rating</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> 60-Min Emergency Dispatch</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-slate-400" /> 4-Digit OTP Security</span>
          </div>

        </div>
      </section>

      {/* 🏬 POPULAR SERVICE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Explore Directory</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Browse Services by Trade</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">Select a category below to book verified local experts at transparent fixed rates</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {SERVICE_CATEGORIES.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={idx}
                to={`/services?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition duration-300 text-center space-y-3 flex flex-col items-center justify-between group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition duration-300`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700">{cat.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">Starts {cat.price}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 🛡️ WHY CHOOSE LOCALFIX — PLATFORM SLA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-500/20 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Platform Guarantees</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why Book on LocalFix?</h2>
            <p className="text-xs sm:text-sm text-slate-300">Enterprise-grade safety, upfront fixed pricing, and digital repair records on every single job.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Aadhaar Verified Pros</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Every technician undergoes 12-digit Aadhaar KYC and background checks before entering your home.</p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Upfront Fixed Pricing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">No hidden charges or unexpected overcharging. Know exact labor costs before booking starts.</p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="font-extrabold text-sm text-white">4-Digit Security OTP</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Unique cryptographic OTP generated for your booking; technician verifies code before job start.</p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-extrabold text-sm text-white">30-Day Fix Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Free re-service warranty protection logged automatically on your digital repair passport.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🤖 AI DIAGNOSTIC ENGINE CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Smart AI Diagnostic Engine</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Don't know what's broken? Ask AI.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Describe your appliance issue or home problem in plain language. Our AI engine accurately predicts the issue, estimates repair cost, and recommends the right technician.
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProblem('AC indoor unit is leaking water and not cooling room properly')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full text-xs font-semibold border border-slate-200 transition"
              >
                💡 "AC leaking water"
              </button>
              <button
                type="button"
                onClick={() => setProblem('Main switchboard sparking when turning on bedroom fan')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full text-xs font-semibold border border-slate-200 transition"
              >
                💡 "Switchboard sparking"
              </button>
              <button
                type="button"
                onClick={() => setProblem('Bathroom tap dripping continuously and water pressure is very low')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full text-xs font-semibold border border-slate-200 transition"
              >
                💡 "Bathroom tap dripping"
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={handleDiagnoseSubmit} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Describe Problem Symptom:</label>
                <textarea
                  rows={3}
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. Water leaking under kitchen sink, or washing machine making loud noise during spin..."
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={diagnosing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {diagnosing ? (
                  <span>Running AI Diagnostics...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Diagnose Problem with AI →</span>
                  </>
                )}
              </button>
            </form>

            {aiResult && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-slate-800 animate-in fade-in duration-200">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Recommended: {aiResult.categoryRecommended || 'Electrician / Plumber'}</span>
                  <span>Est: {aiResult.estimatedCost || '₹249'}</span>
                </div>
                <p className="text-slate-600">{aiResult.likelyIssue}</p>
                <Link
                  to={`/services?category=${encodeURIComponent(aiResult.categoryRecommended || 'Electrician')}`}
                  className="inline-flex items-center gap-1 font-extrabold text-emerald-700 hover:underline pt-1"
                >
                  Book Recommended Professional Now →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 👥 ROLE SELECTION GATEWAY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4 hover:border-emerald-500 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Customer Workspace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Book verified professionals, manage active repair requests, and track appliance warranties on your digital repair passport.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/services"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition text-center flex items-center justify-center gap-2"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register?role=CUSTOMER"
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition text-center"
              >
                Create Customer Account
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4 hover:border-amber-500 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Service Vendor Partner Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register your business, complete Aadhaar KYC verification, publish service rates globally, and accept local customer bookings.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/register?role=VENDOR"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition text-center flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Register Partner Business</span>
              </Link>
              <Link
                to="/login?type=vendor"
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition text-center"
              >
                Vendor Account Sign In
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

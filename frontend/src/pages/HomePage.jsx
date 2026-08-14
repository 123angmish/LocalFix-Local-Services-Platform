import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, Search, ShieldCheck, Wrench, Zap, Droplet, ArrowRight,
  CheckCircle2, AlertTriangle, FileText, Camera, Upload, Shield, Award, Briefcase, User, LayoutDashboard, Globe,
  Scissors, BookOpen, Sparkles as SparklesIcon, Tv, Hammer, Paintbrush, Car, Laptop, Smartphone, Bug, Truck, Star, MapPin, Phone
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  { name: 'Electrician', icon: Zap, color: 'bg-amber-100 text-amber-800 border-amber-200', desc: 'Wiring, MCB switches, ceiling fans & light fixtures' },
  { name: 'Plumber', icon: Droplet, color: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Pipe leakages, taps, basin & bathroom drainage' },
  { name: 'AC Repair', icon: Shield, color: 'bg-teal-100 text-teal-800 border-teal-200', desc: 'Gas charging, foam servicing & cooling issues' },
  { name: 'Appliance Repair', icon: Tv, color: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Washing machine, fridge, microwave & RO repair' },
  { name: 'Beautician & Salon', icon: Scissors, color: 'bg-pink-100 text-pink-800 border-pink-200', desc: 'At-home grooming, haircuts, facials & makeup' },
  { name: 'Cleaner', icon: SparklesIcon, color: 'bg-indigo-100 text-indigo-800 border-indigo-200', desc: 'Full home, kitchen, sofa & bathroom deep clean' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-amber-100 text-amber-900 border-amber-300', desc: 'Furniture assembly, doors, locks & woodwork' },
  { name: 'Painter', icon: Paintbrush, color: 'bg-purple-100 text-purple-800 border-purple-200', desc: 'Wall touch-ups, waterproof coating & painting' },
  { name: 'Tutor', icon: BookOpen, color: 'bg-sky-100 text-sky-800 border-sky-200', desc: 'Home tutoring for Math, Science & exam prep' },
  { name: 'Mechanic', icon: Car, color: 'bg-orange-100 text-orange-800 border-orange-200', desc: 'Two-wheeler & car doorstep oil change & repair' },
  { name: 'Laptop Repair', icon: Laptop, color: 'bg-slate-100 text-slate-800 border-slate-300', desc: 'OS formatting, RAM upgrade, screen replacement' },
  { name: 'Mobile Repair', icon: Smartphone, color: 'bg-rose-100 text-rose-800 border-rose-200', desc: 'Display screen, battery replacement & speaker' },
  { name: 'Pest Control', icon: Bug, color: 'bg-emerald-100 text-emerald-900 border-emerald-300', desc: 'Termite, cockroach & bed bug elimination' },
  { name: 'Packers & Movers', icon: Truck, color: 'bg-cyan-100 text-cyan-800 border-cyan-200', desc: 'Safe house shifting & furniture transportation' }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
        console.warn("Home page using default catalog");
      }
    };
    fetchPopularPros();
  }, []);

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
        statusMessage: "AI service unavailable",
        reason: "Could not reach the AI diagnosis service. Please browse verified professionals directly."
      });
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 bg-slate-50 text-slate-900 font-sans">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest border border-emerald-500/30 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Aadhaar Verified Local Professionals
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Find trusted local professionals near you.
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto">
              Book reliable local service providers for home, repair, beauty, maintenance and more.
            </p>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition transform hover:scale-105 flex items-center justify-center gap-2 border border-emerald-300"
            >
              <Wrench className="w-5 h-5 text-slate-950" />
              <span>Find a Service</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              to="/register?role=VENDOR"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md border border-slate-700 hover:border-slate-600 transition flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Become a Service Provider</span>
            </Link>
          </div>

          {/* Role Choice Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-8 text-slate-900 text-left">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 space-y-3 hover:border-emerald-500 transition">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Need a Service Done?</h3>
              <p className="text-xs text-slate-600">Book verified electricians, plumbers, or salon experts at fixed upfront prices.</p>
              <Link to="/register?role=CUSTOMER" className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1">
                Register as Customer →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 space-y-3 hover:border-amber-500 transition">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Want to Offer Services?</h3>
              <p className="text-xs text-slate-600">Publish your trade business, upload Aadhaar KYC, and accept local customer bookings.</p>
              <Link to="/register?role=VENDOR" className="text-xs font-extrabold text-amber-700 hover:underline flex items-center gap-1">
                Register as Service Provider →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Marketplace Directory</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Popular Service Categories</h2>
          <p className="text-xs text-slate-500">Explore reliable experts across home repair, beauty, and maintenance</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {SERVICE_CATEGORIES.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={idx}
                to={`/services?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition text-center space-y-2 flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700">{cat.name}</h4>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI DIAGNOSTIC ENGINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Smart AI Diagnostic Engine
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Describe Your Repair Issue
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tell us what's broken in natural language. Our AI engine recommends the right service category, estimated price range, and matches local professionals.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={handleDiagnoseSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Describe problem:</label>
                <textarea
                  rows={3}
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. Water leaking from under kitchen sink and main tap is loose..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={diagnosing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {diagnosing ? (
                  <span>Running AI Diagnostics...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Get AI Service Recommendation</span>
                  </>
                )}
              </button>
            </form>

            {aiResult && (
              <div className={`p-4 rounded-2xl border text-xs space-y-3 ${!aiResult.aiAvailable ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-slate-900'}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matched Service: {aiResult.recommendedCategory || 'General Repair'}</span>
                </div>
                <p className="text-xs text-slate-600">{aiResult.reason || aiResult.statusMessage}</p>
                <Link to="/services" className="inline-block text-xs font-bold text-emerald-700 hover:underline">
                  Browse Experts for {aiResult.recommendedCategory || 'this service'} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW LOCALFIX WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Simple & Secure</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How LocalFix Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Select Service & Provider</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse transparent prices, ratings, and service areas for local electricians, plumbers, and salon pros near you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-black text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Schedule & Enter Address</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick your preferred date and time slot. Get an instant 4-digit security OTP sent to your booking dashboard.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">OTP Completion & Warranty</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Technician verifies your OTP before starting work. Every service is protected by a 30-Day Fix Guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* NEARBY PROFESSIONALS DIRECTORY */}
      {nearbyPros.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Verified Directory</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nearby Professionals</h2>
            </div>
            <Link to="/services" className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1">
              Explore All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyPros.map((srv) => (
              <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-emerald-400 transition group">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {srv.imageUrl ? (
                    <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <Wrench className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-900 text-xs font-extrabold rounded-full shadow-sm">
                      {srv.categoryName || 'General Repair'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{srv.vendorBusinessName || 'LocalFix Professional'}</span>
                    <h3 className="font-extrabold text-slate-900 text-base">{srv.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {srv.city || 'Mumbai'}</span>
                      <strong className="text-lg text-slate-900 font-black">₹{srv.price}</strong>
                    </div>

                    <Link
                      to={`/book/${srv.id}`}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE LOCALFIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Platform Trust Guarantee</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why Choose LocalFix?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-base">Aadhaar KYC Verification</h4>
            <p className="text-xs text-slate-500">Every worker sent to customer homes undergoes background & ID verification.</p>
          </div>

          <div className="space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-base">30-Day Fix Warranty</h4>
            <p className="text-xs text-slate-500">Free re-fix protection if any service issue re-occurs within 30 days.</p>
          </div>

          <div className="space-y-2">
            <Tag className="w-8 h-8 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-base">AI Overcharge Protection</h4>
            <p className="text-xs text-slate-500">Quotes are validated against standard regional market rates so you never overpay.</p>
          </div>

          <div className="space-y-2">
            <FileText className="w-8 h-8 text-emerald-600" />
            <h4 className="font-extrabold text-slate-900 text-base">Digital Repair Passport</h4>
            <p className="text-xs text-slate-500">Maintain lifetime digital records of all home maintenance & parts replaced.</p>
          </div>
        </div>
      </section>

      {/* BECOME A PROVIDER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-12 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-emerald-500/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Grow Your Local Service Business</span>
            <h2 className="text-2xl sm:text-3xl font-black">Are You a Skilled Local Technician or Business?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Register as a LocalFix Vendor Partner. Receive direct customer dispatches in your city, manage jobs, and build your digital reputation.
            </p>
          </div>

          <Link
            to="/register?role=VENDOR"
            className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition whitespace-nowrap"
          >
            Become a Service Provider →
          </Link>
        </div>
      </section>
    </div>
  );
};

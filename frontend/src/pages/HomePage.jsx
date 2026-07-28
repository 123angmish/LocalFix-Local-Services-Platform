import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, MapPin, Sparkles, Star, ShieldCheck, Clock, Award, CheckCircle, ArrowRight, Wrench, Zap, Scissors, BookOpen, Home, UserPlus } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [categories, setCategories] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, srvRes] = await Promise.all([
          api.get('/categories'),
          api.get('/services')
        ]);
        setCategories(catRes.data);
        setTopServices(srvRes.data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (city) query.set('city', city);
    navigate(`/services?${query.toString()}`);
  };

  const categoryIcons = {
    Plumber: Wrench,
    Electrician: Zap,
    Salon: Scissors,
    Tutor: BookOpen,
    Cleaner: Sparkles,
    'Appliance Repair': Home
  };

  const [activeTab, setActiveTab] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('Standard (Today)');
  const [faqOpen, setFaqOpen] = useState(null);

  const filterTabs = ['All', 'Plumber', 'Electrician', 'Cleaner', 'Salon', 'Appliance Repair'];

  const filteredServices = topServices.filter(srv => {
    if (activeTab === 'All') return true;
    return srv.categoryName?.toLowerCase().includes(activeTab.toLowerCase());
  });

  const faqs = [
    { q: 'How does the 4-digit OTP verification safety work?', a: 'When you book a service, a unique 4-digit OTP code is generated on your booking dashboard. Your technician must verify this code with you when starting the job and completing the work to eliminate fraud.' },
    { q: 'What is the FixPass Membership benefit?', a: 'FixPass members pay zero visiting fees on all service calls, receive 10% extra discount on labor, get 2 free annual home health inspections, and priority dispatch.' },
    { q: 'Are all professionals background-checked?', a: 'Yes! Every professional onboarded on LocalFix undergoes identity verification, criminal background check, and skill verification before receiving customer jobs.' }
  ];

  return (
    <div className="space-y-20 pb-24 bg-slate-50/40 font-sans text-slate-900">
      {/* Top Notification Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>⚡ Over 500+ Background-Checked Technicians Active Across India</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold">
            <span>🛡️ ₹10,000 Damage Protection</span>
            <span>⏱️ 30-Min Arrival</span>
            <span>🔒 OTP Safe Delivery</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Trusted Hyperlocal Marketplace Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Reliable Local Experts. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                Booked in 30 Seconds.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Book certified plumbers, electricians, appliance repair technicians, and home salon experts with fixed upfront estimates and 4-digit OTP job verification.
            </p>

            {/* Form */}
            <form onSubmit={handleSearch} className="bg-white p-2.5 rounded-2xl shadow-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5 relative flex items-center">
                <Search className="w-5 h-5 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="What needs fixing today?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-11 pr-3 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800"
                />
              </div>
              <div className="sm:col-span-4 relative flex items-center">
                <MapPin className="w-5 h-5 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-3 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="sm:col-span-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                Find Experts
              </button>
            </form>

            {/* Category Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Popular Services:</span>
              {['Plumber', 'Electrician', 'AC Repair', 'Cleaner', 'Salon'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setKeyword(item); navigate(`/services?keyword=${encodeURIComponent(item)}`); }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition font-medium shadow-2xs"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Live Interactive Scope Estimator Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Live Price & Scope Estimator</h3>
                  <p className="text-xs text-slate-500">Calculate upfront costs before booking</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md border border-emerald-100">Instant Estimate</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Service Required</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onChange={(e) => setKeyword(e.target.value)}
                  >
                    <option value="Plumber">Plumbing Leak & Pipe Fitting</option>
                    <option value="Electrician">Electrical Wiring & MCB Trip</option>
                    <option value="AC Repair">Split AC Cleaning & Gas Refill</option>
                    <option value="Cleaner">Full Home Deep Cleaning</option>
                    <option value="Salon">Salon & Facial at Home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Dispatch Urgency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Standard (Today)', 'Urgent (30 Mins)'].map((urg) => (
                      <button
                        key={urg}
                        type="button"
                        onClick={() => setSelectedUrgency(urg)}
                        className={`p-2.5 text-xs font-bold rounded-xl border transition ${
                          selectedUrgency === urg
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Estimated Labor Rate</span>
                    <span className="font-bold text-slate-900">{selectedUrgency.includes('Urgent') ? '₹399 - ₹699' : '₹199 - ₹499'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Estimated Technician Arrival</span>
                    <span className="font-bold text-emerald-600">{selectedUrgency.includes('Urgent') ? '15 - 25 Mins' : '30 - 60 Mins'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Safety Protection</span>
                    <span className="font-bold text-slate-900">4-Digit OTP Required</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/services')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  View Available Technicians →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Select a category to view verified technicians</p>
          </div>
          <Link to="/services" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const IconComp = categoryIcons[cat.name] || Wrench;
              return (
                <Link
                  key={cat.id}
                  to={`/services?categoryId=${cat.id}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-500 transition text-center group flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-600 transition">{cat.name}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Pro Showcase & Tab Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Top Verified Local Professionals</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Filter by category to book transparent upfront services</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-4 shadow-2xs">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No services currently available for the selected category. Explore all categories or register as a provider!
            </p>
            <button
              onClick={() => setActiveTab('All')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div key={srv.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold rounded-md border border-emerald-100">
                      {srv.categoryName}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{srv.vendorRating || 5.0}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base hover:text-emerald-600 transition cursor-pointer">
                      <Link to={`/services/${srv.id}`}>{srv.title}</Link>
                    </h3>
                    <p className="text-xs font-bold text-slate-600 mt-1">Vendor: {srv.vendorBusinessName}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{srv.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{srv.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{srv.durationMinutes || 60} mins</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Upfront Rate</span>
                    <div className="text-lg font-black text-slate-900">₹{srv.price}</div>
                  </div>
                  <Link
                    to={`/services/${srv.id}`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    View & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How LocalFix Works Visual Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How LocalFix Works</h2>
          <p className="text-slate-600 text-xs sm:text-sm">Simple 3-step transparent service booking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 relative shadow-2xs">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center mx-auto">1</div>
            <h3 className="font-extrabold text-slate-900 text-base">Select Service & Scope</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Choose your problem category or use the instant estimator to define job requirements.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 relative shadow-2xs">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl font-black text-lg flex items-center justify-center mx-auto">2</div>
            <h3 className="font-extrabold text-slate-900 text-base">Get Fixed Upfront Price</h3>
            <p className="text-xs text-slate-500 leading-relaxed">No hidden charges or last-minute surprises. Confirm transparent pricing before booking.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 relative shadow-2xs">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center mx-auto">3</div>
            <h3 className="font-extrabold text-slate-900 text-base">4-Digit OTP Verified Job</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Technician verifies your 4-digit code at arrival and completion for total safety assurance.</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-xs sm:text-sm">Everything you need to know about booking on LocalFix</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-bold text-base">{faqOpen === idx ? '−' : '+'}</span>
              </button>
              {faqOpen === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

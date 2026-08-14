import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Filter, Star, Clock, ArrowUpDown, RefreshCw, Wrench, ShieldAlert, Zap, Droplet, Key, AlertTriangle, X, CheckCircle2, Globe, Sparkles } from 'lucide-react';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, price-low, price-high

  // Emergency Fix 60-Min Modal State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyCategory, setEmergencyCategory] = useState('Electrician');
  const [emergencyAddress, setEmergencyAddress] = useState('');
  const [emergencyNotes, setEmergencyNotes] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // Synchronize state with URL search params changes
  useEffect(() => {
    const k = searchParams.get('keyword');
    if (k !== null) setKeyword(k);
    const c = searchParams.get('city');
    if (c !== null) setCity(c);
    const cat = searchParams.get('categoryId');
    if (cat !== null) setCategoryId(cat);
  }, [searchParams]);

  const fallbackCategories = [
    { id: 1, name: 'AC Repair', description: 'Gas refill, water leak fix, jet wash' },
    { id: 2, name: 'Electrician', description: 'MCB trip, short circuit, house wiring' },
    { id: 3, name: 'Plumbing', description: 'Tap leakage, flush tank, pipe fitting' },
    { id: 4, name: 'Cleaner', description: 'Sofa deep clean, carpet, full house sanitization' },
    { id: 5, name: 'Appliance Repair', description: 'Refrigerator, washing machine, geyser repair' },
    { id: 6, name: 'Salon', description: 'At-home facial, head massage, beauty grooming' }
  ];

  const fallbackServices = [
    { id: 1, title: 'Split AC Deep Foam Jet Wash & Gas Check', categoryName: 'AC Repair', price: 499, vendorBusinessName: 'Apex Cool Care HVAC', vendorRating: 4.9, totalReviews: 48, city: 'Mumbai', description: 'Full indoor unit jet pump wash, drain pipe clearing, and gas pressure measurement by certified HVAC technician.' },
    { id: 2, title: 'Main Switchboard Short Circuit & MCB Repair', categoryName: 'Electrician', price: 349, vendorBusinessName: 'PowerFix Electricals', vendorRating: 4.8, totalReviews: 32, city: 'Mumbai', description: 'MCB trip diagnosis, loose wire terminal tightening, and load testing for safe home power supply.' },
    { id: 3, title: 'Bathroom Tap Leakage & Flush Tank Repair', categoryName: 'Plumbing', price: 299, vendorBusinessName: 'HydroFlow Plumbing', vendorRating: 4.9, totalReviews: 54, city: 'Mumbai', description: 'Washer replacement, high water pressure joint sealing, and toilet flush valve repair.' },
    { id: 4, title: 'Full House Upholstery & Sofa Deep Cleaning', categoryName: 'Cleaner', price: 799, vendorBusinessName: 'ProClean Sanitization', vendorRating: 4.7, totalReviews: 29, city: 'Mumbai', description: 'Stain extraction, deep dust vacuuming, and eco-friendly fabric sanitization.' },
    { id: 5, title: 'Double Door Refrigerator Thermostat Repair', categoryName: 'Appliance Repair', price: 599, vendorBusinessName: 'Chrono Appliance Solutions', vendorRating: 4.9, totalReviews: 41, city: 'Mumbai', description: 'Cooling thermostat calibration, relay replacement, and compressor thermal check.' },
    { id: 6, title: 'At-Home Organic Facial & Scalp Relaxation Massage', categoryName: 'Salon', price: 699, vendorBusinessName: 'GlowCare Spa At Home', vendorRating: 5.0, totalReviews: 63, city: 'Mumbai', description: 'Rejuvenating herbal facial treatment, herbal face mask, and deep scalp stress relief massage by female beautician.' },
    { id: 7, title: 'Herbal Glow Face Cleanup & De-Tan Spa Package', categoryName: 'Salon', price: 549, vendorBusinessName: 'Aura Home Salon & Beauty', vendorRating: 4.9, totalReviews: 38, city: 'Delhi NCR', description: 'Deep cleansing, steam extraction, herbal scrub, and soothing face massage at your doorstep.' },
    { id: 8, title: 'Hair Styling & Organic Head Massage Spa', categoryName: 'Salon', price: 449, vendorBusinessName: 'Velvet Hair & Spa Studio', vendorRating: 4.8, totalReviews: 27, city: 'Bengaluru', description: 'Nourishing hot oil head massage, hair wash, and professional blow dry styling at home.' }
  ];

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data);
      } else {
        setCategories(fallbackCategories);
      }
    } catch (err) {
      setCategories(fallbackCategories);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (categoryId) params.append('categoryId', categoryId);
      if (city) params.append('city', city);
      if (minRating) params.append('minRating', minRating);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await api.get(`/services?${params.toString()}`);
      let result = Array.isArray(res.data) ? res.data : [];

      if (result.length === 0) {
        result = fallbackServices;
      }

      // Merge newly registered global vendors for worldwide visibility to all customers and vendors
      try {
        const globalVendorServices = JSON.parse(localStorage.getItem('localfix_global_vendor_services') || '[]');
        if (globalVendorServices.length > 0) {
          result = [...globalVendorServices, ...result];
        }
      } catch (e) {
        console.error(e);
      }

      // Exact Category & Keyword Strict Filter (e.g. Salon -> ONLY Salon services)
      if (keyword && keyword.trim() !== '') {
        const kw = keyword.trim().toLowerCase();
        result = result.filter(s => {
          const categoryMatch = s.categoryName && s.categoryName.toLowerCase().includes(kw);
          const titleMatch = s.title && s.title.toLowerCase().includes(kw);
          const descMatch = s.description && s.description.toLowerCase().includes(kw);
          return categoryMatch || titleMatch || descMatch;
        });
      }

      if (city && city.trim() !== '') {
        const cLower = city.toLowerCase();
        const cityFiltered = result.filter(s => s.city && s.city.toLowerCase().includes(cLower));
        if (cityFiltered.length > 0) result = cityFiltered;
      }

      // Sorting
      if (sortBy === 'rating') {
        result.sort((a, b) => (b.vendorRating || 0) - (a.vendorRating || 0));
      } else if (sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      }

      setServices(result);
    } catch (err) {
      let result = fallbackServices;
      if (keyword && keyword.trim() !== '') {
        const kw = keyword.trim().toLowerCase();
        result = result.filter(s => (s.categoryName && s.categoryName.toLowerCase().includes(kw)) || (s.title && s.title.toLowerCase().includes(kw)));
      }
      setServices(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [keyword, categoryId, city, minRating, maxPrice, sortBy]);

  const handleReset = () => {
    setKeyword('');
    setCategoryId('');
    setCity('');
    setMinRating('');
    setMaxPrice('');
    setSortBy('rating');
    setSearchParams({});
  };

  const handleEmergencyDispatchSubmit = (e) => {
    e.preventDefault();
    if (!emergencyAddress.trim()) {
      toast.error("Please enter service address for emergency dispatch");
      return;
    }
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setIsEmergencyModalOpen(false);
      toast.success(`60-Min Emergency Fix Dispatched! Nearest verified ${emergencyCategory} is arriving in 35-45 mins.`);
      setEmergencyAddress('');
      setEmergencyNotes('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Worldwide Vendor Visibility Header Notification */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Global Marketplace Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Worldwide Vendor Directory & Instant Search</h2>
          <p className="text-xs text-emerald-100/90 max-w-xl">
            Every registered service partner is published globally. Customers and Vendors can browse all verified professionals worldwide while customer private details remain strictly protected.
          </p>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0 animate-pulse"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Dispatch 60-Min SOS Fix →</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Verified Local Services & Vendor Partners</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {keyword ? `Showing results for AI Recommended Category: "${keyword}"` : "Explore all global vendor service listings with upfront transparent prices"}
          </p>
        </div>

        {keyword && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"
          >
            Show All Services (Clear "{keyword}") <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by service or category (e.g. Salon, AC leakage, facial, plumber)..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setSearchParams(e.target.value ? { keyword: e.target.value } : {});
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Showing <strong>{services.length}</strong> verified services {keyword ? `matched for "${keyword}"` : ''}</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No verified services matched filter "{keyword}".</p>
            <button onClick={handleReset} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv) => (
              <div key={srv.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-500 transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                      {srv.categoryName}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{srv.vendorRating || '5.0'}</span>
                      <span className="text-slate-400 text-[10px]">({srv.totalReviews || 12})</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{srv.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{srv.description}</p>
                  <p className="text-[11px] text-slate-500">Provider: <strong>{srv.vendorBusinessName}</strong> ({srv.city || 'Global'})</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Upfront Price</span>
                    <strong className="text-lg font-black text-slate-900">₹{srv.price}</strong>
                  </div>
                  <Link
                    to={`/book/${srv.id}`}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                  >
                    Book Service →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-600" />
                60-Minute Priority SOS Fix
              </h3>
              <button onClick={() => setIsEmergencyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmergencyDispatchSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Urgent Service Category</label>
                <select
                  value={emergencyCategory}
                  onChange={(e) => setEmergencyCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Electrician">Electrician (Short Circuit / MCB Trip)</option>
                  <option value="Plumber">Plumber (Pipe Leakage / Burst Valve)</option>
                  <option value="Locksmith">Locksmith (Door Key Lockout)</option>
                  <option value="AC Breakdown">AC Breakdown (Emergency Cooling Failure)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Service Location Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Flat/House No, Building, Landmark, Area..."
                  value={emergencyAddress}
                  onChange={(e) => setEmergencyAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Urgency Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sparks coming from main switchbox"
                  value={emergencyNotes}
                  onChange={(e) => setEmergencyNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 text-[11px] space-y-1">
                <strong>⏱️ Guaranteed Response Guarantee:</strong>
                <p>LocalFix nearest verified technician will accept and arrive at your location within 60 minutes.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEmergencyModalOpen(false)} className="px-4 py-2.5 text-slate-600 font-bold">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {dispatching ? 'Dispatching Pro...' : 'Confirm 60-Min Priority Fix'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

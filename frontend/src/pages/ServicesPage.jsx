import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Filter, Star, Clock, ArrowUpDown, RefreshCw, Wrench, ShieldAlert, Zap, Droplet, Key, AlertTriangle, X } from 'lucide-react';

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

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
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
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [categoryId, sortBy]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleReset = () => {
    setKeyword('');
    setCategoryId('');
    setCity('');
    setMinRating('');
    setMaxPrice('');
    setSortBy('rating');
    setSearchParams({});
  };

  const handleEmergencyDispatch = async (e) => {
    e.preventDefault();
    setDispatching(true);
    try {
      const res = await api.post('/v1/sos/dispatch', null, {
        params: {
          issueCategory: emergencyCategory,
          address: emergencyAddress,
          notes: emergencyNotes
        }
      });
      toast.success(`60-Minute Emergency Dispatch Triggered! Matched with ${res.data.matchedVendorName || 'Nearest Professional'} (Arrival in ${res.data.etaMinutes || 25} mins)`);
      setIsEmergencyModalOpen(false);
      setEmergencyAddress('');
      setEmergencyNotes('');
    } catch (err) {
      toast.error("Failed to trigger emergency dispatch. Please log in as a customer.");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* 60-Minute Emergency Fix Banner */}
      <div className="bg-rose-950 text-rose-100 p-6 rounded-3xl border border-rose-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-extrabold uppercase tracking-wider border border-rose-500/30">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            60-Minute Priority Dispatch
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Need Urgent Emergency Repairs?</h2>
          <p className="text-xs text-rose-200">Electrician, Plumber, Locksmith, AC Breakdown instant priority dispatch in your local area</p>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300" /> Dispatch 60-Min Emergency Fix
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Browse Verified Local Services</h1>
        <p className="text-sm text-slate-600">Compare upfront prices, verified ratings, and arrival times across verified professionals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Filter className="w-4 h-4 text-emerald-600" />
              Filter Services
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Keyword Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. leak, AC, fan, mcb"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">City / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mumbai, Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5★ & Above</option>
                <option value="4.0">4.0★ & Above</option>
                <option value="3.5">3.5★ & Above</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Services List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-600">
              Found <strong className="text-slate-900">{services.length}</strong> verified services
            </span>

            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Sort by:</span>
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No verified services matched your filters.</p>
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
                        <span className="text-slate-400 text-[10px]">({srv.totalReviews || 1})</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{srv.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                    <p className="text-[11px] text-slate-500">Provider: <strong>{srv.vendorBusinessName}</strong></p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Upfront Price</span>
                      <strong className="text-lg font-black text-slate-900">₹{srv.price}</strong>
                    </div>

                    <Link
                      to={`/book/${srv.id}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                    >
                      Book Professional →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emergency SOS Dispatch Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-base">60-Minute Emergency Dispatch</h3>
              </div>
              <button onClick={() => setIsEmergencyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmergencyDispatch} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Emergency Category</label>
                <select
                  value={emergencyCategory}
                  onChange={(e) => setEmergencyCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Electrician">Electrician (MCB Trip, Sparking, Total Power Cut)</option>
                  <option value="Plumbing">Plumber (Burst Pipe, Severe Leak, Blocked Main Line)</option>
                  <option value="Locksmith">Locksmith (Door Lockout, Key Broken in Lock)</option>
                  <option value="AC Repair">AC Breakdown (Extreme Heat, Gas Leak Smell)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Service Address & Landmark</label>
                <input
                  type="text"
                  required
                  value={emergencyAddress}
                  onChange={(e) => setEmergencyAddress(e.target.value)}
                  placeholder="Flat No, Building Name, Street, Landmark"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Specific Symptoms / Urgent Notes</label>
                <textarea
                  rows={2}
                  value={emergencyNotes}
                  onChange={(e) => setEmergencyNotes(e.target.value)}
                  placeholder="e.g. Main water pipe burst under bathroom sink..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-1">
                <div className="flex justify-between font-bold"><span>Urgent Dispatch Fee:</span> <span>₹150</span></div>
                <p className="text-[10px] text-rose-700">Technician will be dispatched within 10 minutes. Guaranteed arrival under 60 minutes.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEmergencyModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-5 py-2.5 bg-rose-600 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  {dispatching ? "Dispatching..." : "Confirm 60-Min Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

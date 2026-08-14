import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Filter, Star, Clock, ArrowUpDown, RefreshCw, Wrench, ShieldAlert, Zap, Droplet, Key, AlertTriangle, X, CheckCircle2, Globe, Sparkles, Navigation } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState('rating'); // rating, price-low, price-high, nearest

  // Geolocation Coordinates
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationName, setLocationName] = useState('');

  // Synchronize state with URL search params changes
  useEffect(() => {
    const k = searchParams.get('keyword');
    if (k !== null) setKeyword(k);
    const c = searchParams.get('city');
    if (c !== null) setCity(c);
    const cat = searchParams.get('categoryId');
    if (cat !== null) setCategoryId(cat);
  }, [searchParams]);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocationName(`Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}`);
        toast.success("GPS Location acquired!");
        setLocating(false);
        fetchNearbyVendors(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        toast.error("Could not fetch location permission. You can filter by city manually.");
        setLocating(false);
      }
    );
  };

  const fetchNearbyVendors = async (lat, lng) => {
    setLoading(true);
    try {
      const res = await api.get(`/vendors/nearby?lat=${lat}&lng=${lng}&radiusKm=25.0&sortBy=${sortBy}`);
      setServices(res.data || []);
    } catch (err) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
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
      let list = Array.isArray(res.data) ? res.data : [];

      // Sort client-side if needed
      if (sortBy === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        list.sort((a, b) => (b.vendorRating || 0) - (a.vendorRating || 0));
      }

      setServices(list);
    } catch (err) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (userLat && userLng) {
      fetchNearbyVendors(userLat, userLng);
    } else {
      fetchServices();
    }
  }, [keyword, categoryId, city, minRating, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                Explore Services
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2 text-white">
                Find Verified Local Technicians
              </h1>
            </div>

            <button
              onClick={requestGeolocation}
              disabled={locating}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{locating ? 'Acquiring GPS Location...' : locationName || 'Use GPS Location'}</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search AC repair, electrician, plumber, salon..."
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-3 relative">
              <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City / Pincode"
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="nearest">Nearest Location</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar Categories */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setCategoryId('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${!categoryId ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id.toString())}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${categoryId === cat.id.toString() ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Listings Grid */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-xs font-bold text-slate-500">Searching verified local professionals...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No service providers available in your area yet.</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Be the first vendor to list your services in this area, or try expanding your location search.
              </p>
              <Link
                to="/register?type=vendor"
                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition"
              >
                Join as Service Provider →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-200">
                        {srv.categoryName || 'Service'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{srv.vendorRating || '5.0'} ({srv.vendorTotalReviews || 1})</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">{srv.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{srv.description}</p>

                    <div className="text-xs text-slate-500 space-y-1 pt-1">
                      <p className="font-bold text-slate-700">Vendor: {srv.vendorBusinessName || 'Verified Technician'}</p>
                      <p>📍 Location: {srv.city || 'Local Area'} {srv.distanceKm ? `(${srv.distanceKm} km away)` : ''}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Upfront Price</span>
                      <span className="text-xl font-black text-emerald-700">₹{srv.price}</span>
                    </div>

                    <Link
                      to={`/book/${srv.id}`}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

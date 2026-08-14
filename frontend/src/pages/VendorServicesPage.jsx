import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, X, Wrench, Clock, MapPin, RefreshCw, Upload, Image as ImageIcon, Camera, Lock, ShieldCheck, Globe, Eye, Search, Layers, UserCheck } from 'lucide-react';

const PRESET_SAMPLE_PHOTOS = [
  { name: 'Plumber Work', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' },
  { name: 'Electrician Work', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Salon & Grooming', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80' },
  { name: 'Home Cleaning', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' },
  { name: 'AC & Appliance Repair', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80' },
  { name: 'Painting & Carpentry', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' }
];

export const VendorServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [allMarketServices, setAllMarketServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('MY_SERVICES'); // 'MY_SERVICES' or 'ALL_VENDORS'
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    price: '',
    city: 'Mumbai',
    durationMinutes: 60,
    imageUrl: '',
    active: true
  });

  const fetchData = async () => {
    try {
      const [srvRes, catRes, allRes] = await Promise.all([
        api.get('/vendor/services'),
        api.get('/categories'),
        api.get('/services')
      ]);

      const apiServices = Array.isArray(srvRes.data) ? srvRes.data : [];
      setServices(apiServices);

      const marketServices = Array.isArray(allRes.data) ? allRes.data : [];
      setAllMarketServices(marketServices);

      const validCategories = (Array.isArray(catRes.data) ? catRes.data : []).filter(c => {
        if (!c.name || c.name.trim().length < 3) return false;
        const nameLower = c.name.toLowerCase();
        return !['kzhd', 'ljafdsfhdsf', 'asdf', 'test', 'demo'].some(j => nameLower.includes(j));
      });
      setCategories(validCategories);
      if (validCategories.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: validCategories[0].id }));
      }
    } catch (err) {
      // Load vendor's own isolated services fallback
      try {
        const globalSaved = JSON.parse(localStorage.getItem('localfix_global_vendor_services') || '[]');
        setServices(globalSaved);
        setAllMarketServices(globalSaved);
      } catch (e) {
        setServices([]);
        setAllMarketServices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      categoryId: categories[0]?.id || '1',
      title: '',
      description: '',
      price: '',
      city: 'Mumbai',
      durationMinutes: 60,
      imageUrl: PRESET_SAMPLE_PHOTOS[0].url,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      categoryId: srv.categoryId || '1',
      title: srv.title,
      description: srv.description || '',
      price: srv.price,
      city: srv.city || 'Mumbai',
      durationMinutes: srv.durationMinutes || 60,
      imageUrl: srv.imageUrl || '',
      active: srv.active !== undefined ? srv.active : true
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file size should be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
        toast.success("📸 Work Photo attached successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service listing?")) return;
    
    setServices(prev => prev.filter(s => s.id !== id));

    try {
      await api.delete(`/vendor/services/${id}`);
    } catch (err) {
      console.warn("Backend service delete fallback:", err);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('localfix_global_vendor_services') || '[]');
      const updated = existing.filter(s => s.id !== id);
      localStorage.setItem('localfix_global_vendor_services', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    toast.success("Service listing deleted successfully!");
  };

  const handleResetProfession = async () => {
    if (!window.confirm("⚠️ WARNING: This will permanently DELETE your current registered job data so you can register a completely new job. Proceed?")) {
      return;
    }
    setServices([]);
    localStorage.removeItem('localfix_global_vendor_services');

    try {
      await api.delete('/vendor/profession/reset');
    } catch (err) {
      console.warn("Reset fallback:", err);
    }

    toast.success("Previous profession data reset successfully!");
    handleOpenAdd();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/vendor/services/${editingService.id}`, formData);
        toast.success("Service and picture updated successfully!");
      } else {
        await api.post('/vendor/services', formData);
        toast.success("New job/profession saved successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const newService = {
        id: editingService ? editingService.id : Date.now(),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price || 0),
        city: formData.city,
        durationMinutes: parseInt(formData.durationMinutes || 60),
        categoryName: categories.find(c => c.id.toString() === formData.categoryId.toString())?.name || 'General Repair',
        imageUrl: formData.imageUrl || PRESET_SAMPLE_PHOTOS[0].url,
        active: formData.active,
        vendorBusinessName: user?.businessName || user?.name || 'My Service Business'
      };

      if (editingService) {
        setServices(prev => prev.map(s => s.id === editingService.id ? newService : s));
      } else {
        setServices(prev => [newService, ...prev]);
        setAllMarketServices(prev => [newService, ...prev]);
      }

      try {
        const existing = JSON.parse(localStorage.getItem('localfix_global_vendor_services') || '[]');
        const filtered = existing.filter(s => s.id !== newService.id);
        filtered.unshift(newService);
        localStorage.setItem('localfix_global_vendor_services', JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }

      setIsModalOpen(false);
      toast.success("Service package saved and published!");
    }
  };

  const filteredMarketServices = allMarketServices.filter(s => {
    if (!searchKeyword) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      (s.title && s.title.toLowerCase().includes(kw)) ||
      (s.vendorBusinessName && s.vendorBusinessName.toLowerCase().includes(kw)) ||
      (s.categoryName && s.categoryName.toLowerCase().includes(kw)) ||
      (s.city && s.city.toLowerCase().includes(kw))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Service Catalog & Market Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Vendor Control Center
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your service offerings, upload work photos, or explore competitor vendor pricing across the market
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetProfession}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Reset and register a different job title"
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
            Reset Profession
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Register New Service / Job Offering
          </button>
        </div>
      </div>

      {/* Interactive View Selector Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <button
            onClick={() => setActiveTab('MY_SERVICES')}
            className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === 'MY_SERVICES'
                ? 'bg-white text-emerald-900 shadow-md border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>My Registered Services</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_VENDORS')}
            className={`py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
              activeTab === 'ALL_VENDORS'
                ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Browse All Market Vendor Services</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {allMarketServices.length}
            </span>
          </button>
        </div>

        {activeTab === 'ALL_VENDORS' && (
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search vendor business or service name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : activeTab === 'MY_SERVICES' ? (
        /* MY SERVICES TAB */
        services.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Active Service Registered</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You currently have no registered job entries in your catalog. Click **Register New Service** above to enter your job title, upload pictures, and set prices!
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Job & Add Pictures
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                {/* Picture Banner */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {srv.imageUrl ? (
                    <img
                      src={srv.imageUrl}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-semibold">No Picture Attached</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-bold rounded-full shadow-sm">
                      {srv.categoryName || 'General Repair'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded backdrop-blur-md shadow-sm ${srv.active !== false ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                      {srv.active !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {srv.city || 'Mumbai'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {srv.durationMinutes || 60} mins</span>
                      <strong className="text-base text-slate-900 font-extrabold">₹{srv.price}</strong>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Details & Photo
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                        title="Delete Service Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ALL MARKET VENDORS TAB */
        filteredMarketServices.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Globe className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No competitor vendor services found for this search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredMarketServices.map((srv) => (
              <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition border-t-4 border-t-blue-500">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {srv.imageUrl ? (
                    <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold rounded-full shadow">
                      {srv.vendorBusinessName || 'Market Vendor Partner'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full shadow">
                      Market Listing
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{srv.categoryName || 'General Service'}</span>
                    <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {srv.city || 'Mumbai'}</span>
                      <strong className="text-base text-slate-900 font-extrabold">₹{srv.price}</strong>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Rating: ⭐ {srv.vendorRating || 5.0}</span>
                      <span className="text-blue-600 font-bold text-[11px]">Market Competitor</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl space-y-4 my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingService ? 'Edit Job & Work Photo' : 'Register New Job & Upload Work Photo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    Service Work Photo
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">JPG, PNG, WEBP (Max 10MB)</span>
                </div>

                {formData.imageUrl ? (
                  <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md group bg-slate-900">
                    <img src={formData.imageUrl} alt="Work preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-[11px] font-extrabold text-white bg-emerald-600 px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 p-6 rounded-2xl transition flex flex-col items-center justify-center gap-2 group text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition flex items-center justify-center font-bold">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-xs font-black text-slate-900 block group-hover:text-emerald-800">
                        📸 Click to Upload Photo from Gallery / Device
                      </strong>
                      <span className="text-[11px] text-slate-500">Supports photos taken from Mobile Camera or Gallery</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className="cursor-pointer py-2 px-3 bg-white border border-slate-200 hover:border-emerald-400 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload New Device File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Or paste image URL link"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Or Select Sample Work Photo:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_SAMPLE_PHOTOS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, imageUrl: p.url })}
                        className={`text-[10px] p-1.5 rounded-lg border text-left truncate transition ${formData.imageUrl === p.url ? 'border-emerald-600 bg-emerald-600 text-white font-extrabold shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium'}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  ) : (
                    <option value="1">General Repair</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Job Title / Profession (e.g. Barber, Postman)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Barber Service / Electrician / Plumber"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Service Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="350"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Estimated Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  placeholder="60"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Job Description & Details</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail your professional experience, tools carried, and service guarantees..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="active" className="text-xs font-medium text-slate-700">
                  Service active and visible to local customers in {formData.city || 'Mumbai'}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                >
                  {editingService ? 'Update Service & Photo' : 'Publish Service Offering →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, Wrench, Clock, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';

export const VendorServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    active: true
  });

  const fetchData = async () => {
    try {
      const [srvRes, catRes] = await Promise.all([
        api.get('/vendor/services'),
        api.get('/categories')
      ]);
      setServices(srvRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      toast.error("Failed to load vendor services");
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
      categoryId: categories[0]?.id || '',
      title: '',
      description: '',
      price: '',
      city: 'Mumbai',
      durationMinutes: 60,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      categoryId: srv.categoryId,
      title: srv.title,
      description: srv.description || '',
      price: srv.price,
      city: srv.city,
      durationMinutes: srv.durationMinutes || 60,
      active: srv.active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/vendor/services/${id}`);
      toast.success("Service deleted successfully from database");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  const handleResetProfession = async () => {
    if (!window.confirm("⚠️ WARNING: This will permanently DELETE your current registered job/profession data from the SQL Database so you can register a completely new job (e.g. Barber -> Postman). Do you want to proceed?")) {
      return;
    }
    try {
      await api.delete('/vendor/profession/reset');
      toast.success("Previous profession data permanently deleted from database. Enter your new job!");
      setServices([]);
      handleOpenAdd();
    } catch (err) {
      toast.error("Failed to reset profession data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/vendor/services/${editingService.id}`, formData);
        toast.success("Service updated successfully");
      } else {
        await api.post('/vendor/services', formData);
        toast.success("New job/profession registered and pushed to SQL database!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage My Profession & Services</h1>
          <p className="text-sm text-slate-600">Register new job, set prices, or delete old profession data to switch jobs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetProfession}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            title="Delete current job data from SQL DB and register a new profession"
          >
            <RefreshCw className="w-4 h-4" />
            Switch / Reset Profession
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Job Package
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Active Profession Registered</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You currently have no registered job entries in the database. Click **Add New Job Package** above to enter your job title (e.g., Barber, Postman, Electrician) and price limit!
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Register Job & Price Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {srv.categoryName}
                  </span>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${srv.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {srv.active ? 'Active on Database' : 'Disabled'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-500" /> {srv.city}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {srv.durationMinutes} mins</span>
                  <strong className="text-base text-slate-900 font-extrabold">₹{srv.price}</strong>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Job Details
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
                    title="Delete Job Entry from SQL Database"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingService ? 'Edit Job Entry' : 'Register New Profession / Job'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Job Title / Profession (e.g. Barber, Postman)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Professional Barber Services"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Service Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="200"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mumbai, Delhi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Estimated Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  placeholder="60"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Job Description & Details</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your service offering and pricing details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save to SQL Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

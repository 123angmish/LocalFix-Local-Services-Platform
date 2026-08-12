import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Building, Plus, Wrench, CheckCircle2, Clock, Shield, Users, ArrowRight, X } from 'lucide-react';

export const SocietyDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    address: '',
    city: 'Mumbai',
    propertyType: 'Apartment Society' // Apartment Society, Hostel/PG, Commercial Complex
  });

  const fetchProperties = async () => {
    try {
      const res = await api.get('/v1/properties');
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load society properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddSociety = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/properties', null, {
        params: form
      });
      toast.success(`${form.propertyType} registered successfully!`);
      setIsModalOpen(false);
      setForm({ title: '', address: '', city: 'Mumbai', propertyType: 'Apartment Society' });
      fetchProperties();
    } catch (err) {
      toast.error("Failed to register property");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-32 bg-slate-200 rounded-3xl animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            Society & PG Management Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Apartment / Hostel Maintenance Dashboard</h1>
          <p className="text-xs text-slate-300">Centralized maintenance ticketing, assigned electricians/plumbers, and monthly building expenditure</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Register Society / Hostel
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Registered Buildings / Complexes</span>
          <div className="text-2xl font-extrabold text-slate-900">{properties.length}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Active Maintenance Requests</span>
          <div className="text-2xl font-extrabold text-emerald-700">3 Tickets</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Dedicated Society Electrician / Plumber</span>
          <div className="text-2xl font-extrabold text-amber-600">Assigned</div>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">My Managed Properties & PG Hostels</h3>

        {properties.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No society or PG hostel registered yet. Click "Register Society" to start!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-500 transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                      {prop.propertyType || 'Apartment Complex'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">ID #{prop.id}</span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base">{prop.title}</h4>
                  <p className="text-xs text-slate-600">{prop.address}, {prop.city}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Monthly Tickets: <strong>4 Resolved</strong></span>
                  <button className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition">
                    Manage Society Maintenance →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Register Society / Hostel Complex</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSociety} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Society / Hostel Name</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Green Meadows Cooperative Housing Society"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Property Type</label>
                <select
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Apartment Society">Apartment Society (Co-op Housing)</option>
                  <option value="Hostel / PG">Hostel / Paying Guest (PG)</option>
                  <option value="Commercial Complex">Commercial Office Complex</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Address / Area</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Sector 15, Vashi"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md">
                  Register Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

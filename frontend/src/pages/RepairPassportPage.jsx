import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, Plus, Wrench, Calendar, IndianRupee, Cpu, ArrowRight, X, Clock, FileText } from 'lucide-react';

export const RepairPassportPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [applianceForm, setApplianceForm] = useState({
    name: '',
    brand: '',
    model: '',
    purchaseYear: new Date().getFullYear(),
    serialNumber: ''
  });

  const fetchPassportData = async () => {
    try {
      const res = await api.get('/customer/passport/summary');
      setSummary(res.data);
    } catch (err) {
      toast.error("Failed to load Repair Passport data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassportData();
  }, []);

  const handleAddAppliance = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customer/passport/appliances', applianceForm);
      toast.success("New appliance asset added to Repair Passport!");
      setIsAddModalOpen(false);
      setApplianceForm({ name: '', brand: '', model: '', purchaseYear: new Date().getFullYear(), serialNumber: '' });
      fetchPassportData();
    } catch (err) {
      toast.error("Failed to add appliance asset");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Digital Asset Passport
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">My Repair Passports</h1>
          <p className="text-xs text-slate-300">Permanent digital maintenance records, part replacement logs, and warranty history</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Asset / Appliance
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Registered Assets</span>
          <div className="text-2xl font-extrabold text-slate-900">{summary?.totalAppliances || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Completed Repairs</span>
          <div className="text-2xl font-extrabold text-slate-900">{summary?.totalRepairsCount || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Maintenance Spent</span>
          <div className="text-2xl font-extrabold text-emerald-700">₹{summary?.totalMaintenanceSpent || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Parts Replaced</span>
          <div className="text-2xl font-extrabold text-amber-600">{summary?.totalPartsReplaced || 0}</div>
        </div>
      </div>

      {/* Registered Appliances & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Appliance Cards */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Registered Home Assets</h3>
          {(!summary?.appliances || summary.appliances.length === 0) ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500">No appliances registered yet. Click "Add Asset" to start tracking repairs!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {summary.appliances.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-emerald-500 transition">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm">{app.name}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                      Year {app.purchaseYear || 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Brand: <strong>{app.brand || 'Generic'}</strong> | Model: {app.model || 'Standard'}</p>
                  {app.serialNumber && <p className="text-[10px] font-mono text-slate-400">S/N: {app.serialNumber}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Lifetime Service Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Digital Repair History Timeline</h3>
          {(!summary?.recentTimeline || summary.recentTimeline.length === 0) ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
              <Wrench className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No completed repair entries logged in your digital passport timeline yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {summary.recentTimeline.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Passport Entry #{item.id}</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{item.appliance?.name || 'Home Repair'}</h4>
                    </div>
                    <span className="font-black text-slate-900 text-base">₹{item.totalSpent}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed"><strong>Work Performed:</strong> {item.workSummary}</p>

                  {item.diagnosisSummary && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                      Diagnosis: "{item.diagnosisSummary}"
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px] pt-1 text-slate-400 border-t border-slate-100">
                    <span>Parts Replaced: <strong>{item.partsReplacedCount}</strong></span>
                    <span>Log Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Appliance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Register New Appliance Asset</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAppliance} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Asset Name (e.g. Master Bedroom AC)</label>
                <input
                  type="text"
                  required
                  value={applianceForm.name}
                  onChange={(e) => setApplianceForm({ ...applianceForm, name: e.target.value })}
                  placeholder="Master Bedroom AC"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand</label>
                  <input
                    type="text"
                    value={applianceForm.brand}
                    onChange={(e) => setApplianceForm({ ...applianceForm, brand: e.target.value })}
                    placeholder="LG, Samsung"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Model</label>
                  <input
                    type="text"
                    value={applianceForm.model}
                    onChange={(e) => setApplianceForm({ ...applianceForm, model: e.target.value })}
                    placeholder="Split 1.5 Ton"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Purchase Year</label>
                  <input
                    type="number"
                    value={applianceForm.purchaseYear}
                    onChange={(e) => setApplianceForm({ ...applianceForm, purchaseYear: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Serial Number</label>
                  <input
                    type="text"
                    value={applianceForm.serialNumber}
                    onChange={(e) => setApplianceForm({ ...applianceForm, serialNumber: e.target.value })}
                    placeholder="Optional S/N"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, IndianRupee, FileText, CheckCircle2, Star, Power, Clock, Plus, Upload, X } from 'lucide-react';

export const ProviderSaaSPage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    todayJobs: 4,
    monthlyEarnings: 28450,
    repeatCustomersCount: 12,
    rating: 4.9
  });
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);
  const [partsForm, setPartsForm] = useState({
    bookingId: '',
    workNotes: '',
    partName: '',
    partPrice: '',
    oldPartFile: null,
    newPartFile: null
  });

  const handleToggleStatus = () => {
    setIsOnline(!isOnline);
    toast.success(`Availability status set to ${!isOnline ? 'Online (Accepting Jobs)' : 'Offline'}`);
  };

  const handlePartsProofSubmit = (e) => {
    e.preventDefault();
    toast.success("Before/After photos and replaced part invoice uploaded successfully!");
    setIsPartsModalOpen(false);
    setPartsForm({ bookingId: '', workNotes: '', partName: '', partPrice: '', oldPartFile: null, newPartFile: null });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 font-sans">
      {/* Header & Mini CRM Status */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Technician Mini-CRM SaaS</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Provider Operations Hub</h1>
          <p className="text-xs text-slate-300">Manage dispatch jobs, customer invoices, parts replacement logs, and repeat client directory</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPartsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Upload Parts Proof
          </button>

          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 ${
              isOnline ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            <Power className="w-4 h-4" />
            {isOnline ? 'Status: ONLINE' : 'Status: OFFLINE'}
          </button>
        </div>
      </div>

      {/* Mini-CRM Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Today's Jobs</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats.todayJobs} Assigned</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Monthly Payout Earnings</span>
          <div className="text-2xl font-extrabold text-emerald-700">₹{stats.monthlyEarnings}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Repeat Clients</span>
          <div className="text-2xl font-extrabold text-amber-600">{stats.repeatCustomersCount} Regulars</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Customer Review Rating</span>
          <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
            {stats.rating}★ <span className="text-xs font-normal text-slate-400">(48 Reviews)</span>
          </div>
        </div>
      </div>

      {/* CRM Sections: Repeat Customer Directory & Recent Job Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Repeat Customer Directory
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { name: 'Rajesh Sharma', phone: '+91 98201 11223', jobsCount: 3, lastService: 'AC Gas Refill' },
              { name: 'Priya Verma', phone: '+91 98765 43210', jobsCount: 2, lastService: 'MCB Rewiring' },
              { name: 'Amit Patel', phone: '+91 99300 88776', jobsCount: 4, lastService: 'Plumbing Leak Fix' }
            ].map((cust, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block font-bold">{cust.name}</strong>
                  <span className="text-slate-500">{cust.phone} • Last: {cust.lastService}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold rounded-lg text-[10px]">
                  {cust.jobsCount} Completed Jobs
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Digital Job Invoices & Parts Proof
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { id: 'INV-1092', service: 'Split AC Gas Top-up & Jet Wash', amount: 1499, date: '11 Aug 2026', proofStatus: 'Proof Uploaded' },
              { id: 'INV-1088', service: 'Main Distribution MCB Replacement', amount: 850, date: '09 Aug 2026', proofStatus: 'Proof Uploaded' }
            ].map((inv, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block font-bold">#{inv.id} - {inv.service}</strong>
                  <span className="text-slate-500">Date: {inv.date}</span>
                </div>
                <div className="text-right">
                  <strong className="text-slate-900 block font-black">₹{inv.amount}</strong>
                  <span className="text-[10px] text-emerald-600 font-bold">✔ {inv.proofStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parts Proof Modal */}
      {isPartsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Compulsory Parts Proof Upload</h3>
              <button onClick={() => setIsPartsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePartsProofSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Booking Reference #</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104"
                  value={partsForm.bookingId}
                  onChange={(e) => setPartsForm({ ...partsForm, bookingId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Replaced Part Name</label>
                  <input
                    type="text"
                    required
                    placeholder="LG 45 MFD Capacitor"
                    value={partsForm.partName}
                    onChange={(e) => setPartsForm({ ...partsForm, partName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Part Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={partsForm.partPrice}
                    onChange={(e) => setPartsForm({ ...partsForm, partPrice: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Old Part Photo (Compulsory)</label>
                <input type="file" required accept="image/*" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">New Part / Invoice Photo (Compulsory)</label>
                <input type="file" required accept="image/*" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsPartsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md">
                  Submit Parts Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

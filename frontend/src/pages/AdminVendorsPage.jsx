import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Store, Check, X, ShieldCheck, Star, Search } from 'lucide-react';

export const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterApproved, setFilterApproved] = useState('ALL');

  const fetchVendors = async () => {
    try {
      const res = await api.get('/admin/vendors');
      setVendors(res.data);
    } catch (err) {
      toast.error("Failed to load vendors list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/approve`);
      toast.success("Vendor approved successfully!");
      fetchVendors();
    } catch (err) {
      toast.error("Failed to approve vendor");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/vendors/${id}/reject`);
      toast.success("Vendor application rejected/disabled");
      fetchVendors();
    } catch (err) {
      toast.error("Failed to reject vendor");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    if (filterApproved === 'PENDING') return !v.approved;
    if (filterApproved === 'APPROVED') return v.approved;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Application Approvals</h1>
          <p className="text-sm text-slate-600">Approve new vendor partners or manage existing platform vendor profiles</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          {['ALL', 'PENDING', 'APPROVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterApproved(f)}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterApproved === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-sm text-slate-500">No vendors found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVendors.map((v) => (
            <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Vendor ID #{v.id}</span>
                    <h3 className="font-extrabold text-slate-900 text-lg">{v.businessName}</h3>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    v.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {v.approved ? 'APPROVED' : 'PENDING APPROVAL'}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{v.description || 'No business description provided.'}</p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                  <div><strong className="text-slate-800">Owner Name:</strong> {v.user?.name}</div>
                  <div><strong className="text-slate-800">Email:</strong> {v.user?.email}</div>
                  <div><strong className="text-slate-800">Phone:</strong> {v.user?.phone || 'N/A'}</div>
                  <div><strong className="text-slate-800">City / Address:</strong> {v.city} - {v.address}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                {!v.approved ? (
                  <>
                    <button
                      onClick={() => handleReject(v.id)}
                      className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(v.id)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Approve Vendor
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReject(v.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Revoke / Disable Approval
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

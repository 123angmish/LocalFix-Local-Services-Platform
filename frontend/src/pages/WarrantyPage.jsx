import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, MessageSquare, X } from 'lucide-react';

export const WarrantyPage = () => {
  const [warranties, setWarranties] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [claimIssue, setClaimIssue] = useState('');

  const fetchData = async () => {
    try {
      const [wRes, cRes] = await Promise.all([
        api.get('/customer/warranties'),
        api.get('/customer/warranty-claims')
      ]);
      setWarranties(wRes.data || []);
      setClaims(cRes.data || []);
    } catch (err) {
      toast.error("Failed to load warranty data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimIssue.trim() || !selectedWarranty) return;

    try {
      await api.post(`/customer/warranties/${selectedWarranty.id}/claims`, {
        issueDescription: claimIssue
      });
      toast.success("Warranty claim submitted to LocalFix resolution team!");
      setSelectedWarranty(null);
      setClaimIssue('');
      fetchData();
    } catch (err) {
      toast.error("Failed to submit warranty claim");
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
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Service Warranties</h1>
        <p className="text-sm text-slate-600">30-Day protection on completed repair jobs and replaced components</p>
      </div>

      {/* Warranties Grid */}
      {warranties.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">No active service warranties found. Complete a service booking to unlock 30-day coverage!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warranties.map((w) => (
            <div key={w.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    Warranty #{w.id}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    w.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                    w.status === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800' :
                    w.status === 'CLAIMED' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {w.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{w.serviceName}</h3>
                <p className="text-xs text-slate-500">Booking Reference: #{w.booking?.id || w.bookingId}</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between"><span>Valid From:</span> <strong>{w.startDate}</strong></div>
                  <div className="flex justify-between"><span>Expires On:</span> <strong>{w.endDate}</strong></div>
                </div>
              </div>

              {w.status !== 'EXPIRED' && w.status !== 'CLAIMED' && (
                <button
                  onClick={() => setSelectedWarranty(w)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Raise Warranty Claim
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Claim Modal */}
      {selectedWarranty && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">File Warranty Claim</h3>
              <button onClick={() => setSelectedWarranty(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <strong>Warranty #{selectedWarranty.id}:</strong> {selectedWarranty.serviceName}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Describe the re-occurring issue or defect:</label>
                <textarea
                  rows={4}
                  required
                  value={claimIssue}
                  onChange={(e) => setClaimIssue(e.target.value)}
                  placeholder="e.g. AC water leakage started again from the left side..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedWarranty(null)} className="px-4 py-2 text-slate-600 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md">
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

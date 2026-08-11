import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, X } from 'lucide-react';

export const DisputePage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    try {
      const res = await api.get('/user/disputes');
      setDisputes(res.data || []);
    } catch (err) {
      toast.error("Failed to load disputes history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Marketplace Dispute Resolution</h1>
        <p className="text-sm text-slate-600">Track and review open pricing issues, incomplete work, or payment disputes</p>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">No active or past disputes raised.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 text-base">Dispute #{d.id}</span>
                  <span className="px-3 py-0.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                    Reason: {d.reason}
                  </span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                  d.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                  d.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  Status: {d.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><strong>Description:</strong> {d.description}</p>
              {d.adminNotes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong>Admin Resolution Notes:</strong> {d.adminNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

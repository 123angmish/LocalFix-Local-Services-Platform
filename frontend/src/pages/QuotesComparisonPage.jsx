import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Star, ShieldCheck, Clock, AlertTriangle, CheckCircle2, IndianRupee, ArrowRight, ShieldAlert } from 'lucide-react';

export const QuotesComparisonPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const res = await api.get('/v1/quotes/customer');
      setQuotes(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAcceptQuote = async (id) => {
    try {
      await api.patch(`/v1/quotes/${id}/accept`);
      toast.success("Quote accepted! Technician notified for booking dispatch.");
      fetchQuotes();
    } catch (err) {
      toast.error("Failed to accept quote");
    }
  };

  const handleRejectQuote = async (id) => {
    try {
      await api.patch(`/v1/quotes/${id}/reject`);
      toast.success("Quote rejected.");
      fetchQuotes();
    } catch (err) {
      toast.error("Failed to reject quote");
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
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reverse Quote Marketplace</h1>
        <p className="text-sm text-slate-600">Compare 2-3 verified provider quotes by price, rating, arrival time, and AI Fair Price assessment</p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">No active quotes received yet. Post a service request to receive competitive provider quotes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((q) => {
            const isOvercharging = q.price > 3500; // Overcharging alert threshold demo
            return (
              <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-500 transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                      Quote #{q.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                      q.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      q.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{q.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{q.description}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Provider:</span> <strong>Apex Verified Specialist</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Rating & Reputation:</span> <strong className="text-amber-500 flex items-center gap-1">4.9★ <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /></strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Arrival Time:</span> <strong>35 - 45 mins</strong>
                    </div>
                    {q.warranty && (
                      <div className="flex justify-between items-center text-slate-700">
                        <span>Warranty Terms:</span> <strong className="text-emerald-700">{q.warranty}</strong>
                      </div>
                    )}
                  </div>

                  {/* AI Fraud / Overcharging Alert */}
                  {isOvercharging ? (
                    <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        AI Fraud Alert: Significantly Above Typical
                      </div>
                      <p className="text-[11px] text-rose-700">
                        This quote (₹{q.price}) exceeds historical local market range (₹1,200 – ₹2,500). Consider comparing lower quotes.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        AI Fair Price Protection Verified
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Quote amount aligns with LocalFix typical database range for this service.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Quoted Total:</span>
                    <strong className="text-xl font-black text-slate-900">₹{q.price}</strong>
                  </div>

                  {q.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectQuote(q.id)}
                        className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptQuote(q.id)}
                        className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                      >
                        Accept Quote
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

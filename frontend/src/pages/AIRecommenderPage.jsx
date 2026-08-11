import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Sparkles, AlertTriangle, Clock, IndianRupee, HelpCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AIRecommenderPage = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const samplePrompts = [
    "My kitchen sink is leaking and water is spreading on the floor",
    "Short circuit in main switchboard causing sparks and power trip",
    "AC is blowing warm air and making buzzing sounds",
    "Refrigerator is not cooling and leaking water onto floor",
    "Bathroom flush tank is overflowing continuously"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend-service', { problem });
      setRecommendation(res.data);
      if (res.data.aiAvailable) {
        toast.success("AI Diagnosis ready!");
      }
    } catch (err) {
      setRecommendation({
        aiAvailable: false,
        statusMessage: "AI service unavailable",
        reason: "Could not connect to external AI API service."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Smart Service Diagnostic Assistant
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Describe Your Problem, Get Instant AI Diagnosis
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          State your issue in natural language. Our AI engine evaluates likely causes, severity, price range, and matches verified specialists.
        </p>
      </div>

      {/* Interactive Problem Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Describe your issue in detail:
            </label>
            <textarea
              rows={3}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. My AC is leaking water from the indoor unit and cooling is very low..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-semibold my-auto">Try sample queries:</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setProblem(prompt)}
                className="text-[11px] px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-medium rounded-full transition"
              >
                "{prompt.slice(0, 30)}..."
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Running AI Diagnosis...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Get AI Service Diagnosis & Price Estimate</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recommendation Results Card */}
      {recommendation && (
        <div className="space-y-4">
          {!recommendation.aiAvailable ? (
            /* AI Service Unavailable Clean Fallback Card */
            <div className="bg-amber-50 border border-amber-200 text-amber-950 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-amber-900">AI Service Unavailable</h3>
                  <p className="text-xs text-amber-800">{recommendation.reason || "No external AI API key configured in environment variables (AI_API_KEY)."}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">Need help right now?</p>
                <p>You can still browse our verified local professionals, compare upfront prices, and book instant emergency services directly!</p>
              </div>

              <Link
                to="/services"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md text-center block transition flex items-center justify-center gap-2"
              >
                <span>Browse Verified Professionals Directly</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* AI Active Structured Output Card (Emerald & White Theme) */
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-xl space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    AI Diagnosis Output
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">Recommended Service: {recommendation.recommendedCategory}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  recommendation.urgency === 'URGENT' || recommendation.urgency === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  recommendation.urgency === 'MEDIUM' || recommendation.urgency === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  Urgency: {recommendation.urgency}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Estimated Duration
                  </span>
                  <div className="text-base font-extrabold text-slate-900">{recommendation.estimatedDuration}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Estimated Price Range
                  </span>
                  <div className="text-base font-extrabold text-emerald-700">{recommendation.estimatedPriceRange}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <span className="font-bold text-slate-700">AI Analysis & Diagnosis:</span>
                <p className="text-slate-600 leading-relaxed italic">"{recommendation.reason}"</p>
              </div>

              {recommendation.disclaimer && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                  ⚠️ <strong>Disclaimer:</strong> {recommendation.disclaimer}
                </div>
              )}

              <div className="pt-2">
                <Link
                  to={`/services?keyword=${encodeURIComponent(recommendation.recommendedCategory || '')}`}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md text-center block transition flex items-center justify-center gap-2"
                >
                  <span>Search Matched {recommendation.recommendedCategory} Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

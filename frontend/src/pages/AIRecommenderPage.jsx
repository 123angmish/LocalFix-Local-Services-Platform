import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Sparkles, AlertTriangle, Clock, IndianRupee, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AIRecommenderPage = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const samplePrompts = [
    "My kitchen sink is leaking and water is spreading on the floor",
    "Short circuit in main switchboard causing sparks and power trip",
    "Need deep cleaning for sofa and living room carpet",
    "Refrigerator is not cooling and making loud buzzing noise",
    "Looking for a salon facial and head massage at home"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend-service', { problem });
      setRecommendation(res.data);
      toast.success("AI Recommendation ready!");
    } catch (err) {
      toast.error("Failed to generate recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
          <Sparkles className="w-4 h-4" />
          Smart Service Assistant
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Describe Your Problem, Get Instant Solution Recommendations
        </h1>
        <p className="text-sm text-slate-600">
          State your issue in natural language. Our AI engine diagnoses urgency, estimated duration, price range, and matches you with verified specialists.
        </p>
      </div>

      {/* Interactive Problem Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
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
              placeholder="e.g. My kitchen sink is leaking and water is spreading across the tiles..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
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
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Analyzing Issue...</span>
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
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 p-8 rounded-3xl text-white shadow-2xl space-y-6 animate-fade-in border border-emerald-500/20">
          <div className="flex justify-between items-start border-b border-emerald-800/80 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Diagnosis Output</span>
              <h3 className="text-2xl font-extrabold text-white">Recommended Service: {recommendation.recommendedCategory}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              recommendation.urgency === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              recommendation.urgency === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              Urgency: {recommendation.urgency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Estimated Duration
              </span>
              <div className="text-lg font-bold text-white">{recommendation.estimatedDuration}</div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" /> Estimated Price Range
              </span>
              <div className="text-lg font-bold text-amber-300">{recommendation.estimatedPriceRange}</div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs text-emerald-300 font-medium">AI Analysis Reason</span>
            <p className="text-xs text-emerald-100/90 leading-relaxed italic">"{recommendation.reason}"</p>
          </div>

          <div className="pt-2">
            <Link
              to={`/services?keyword=${encodeURIComponent(recommendation.recommendedCategory)}`}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md text-center block transition flex items-center justify-center gap-2"
            >
              <span>Search Matching {recommendation.recommendedCategory} Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

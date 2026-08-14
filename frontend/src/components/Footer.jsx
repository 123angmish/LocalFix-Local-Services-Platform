import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Heart, ShieldCheck, CheckCircle2, Lock, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-black text-2xl text-white tracking-tight">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-900/50">
                <Wrench className="w-5 h-5" />
              </div>
              <span>Local<span className="text-emerald-400">Fix</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's trusted local service marketplace connecting households with verified electricians, plumbers, AC technicians, beauticians, and repair experts.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-extrabold border border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Aadhaar Verified Pros
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-[10px] font-extrabold border border-slate-800 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> 256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs mb-4 uppercase tracking-widest text-emerald-400">Marketplace Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/services" className="hover:text-emerald-400 transition flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-slate-500" /> Explore All Services</Link></li>
              <li><Link to="/ai-recommender" className="hover:text-emerald-400 transition flex items-center gap-1.5"><SparklesIcon className="w-3.5 h-3.5 text-amber-400" /> Smart AI Diagnosis</Link></li>
              <li><Link to="/register?role=VENDOR" className="hover:text-emerald-400 transition flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Become a Service Vendor</Link></li>
              <li><Link to="/repair-passport" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Digital Repair Passport</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs mb-4 uppercase tracking-widest text-emerald-400">Popular Service Trade</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/services?category=Plumber" className="hover:text-emerald-400 transition">Plumbing & Pipe Repair</Link></li>
              <li><Link to="/services?category=Electrician" className="hover:text-emerald-400 transition">Electrical & MCB Wiring</Link></li>
              <li><Link to="/services?category=Beautician" className="hover:text-emerald-400 transition">At-Home Salon & Grooming</Link></li>
              <li><Link to="/services?category=Cleaner" className="hover:text-emerald-400 transition">Full House Deep Cleaning</Link></li>
              <li><Link to="/services?category=AC%20Repair" className="hover:text-emerald-400 transition">AC Foam Jet Servicing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs mb-4 uppercase tracking-widest text-emerald-400">Trust & Security SLA</h4>
            <div className="text-xs space-y-3 text-slate-400">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>30-Day Fix Guarantee:</strong> Free re-service protection logged on completed jobs.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>4-Digit Security OTP:</strong> Technicians verify OTP before starting home repairs.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Razorpay & UPI Payments:</strong> 100% secure checkout via Google Pay, PhonePe & Paytm.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LocalFix Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Engineered with <Heart className="w-4 h-4 text-rose-500 fill-current" /> for startup-grade local services.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

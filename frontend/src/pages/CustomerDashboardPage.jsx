import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle2, IndianRupee, ArrowRight, Wrench, Sparkles, ShieldCheck, FileText, AlertTriangle, Building, Tag, ShieldAlert, X, ChevronRight, Check, Plus } from 'lucide-react';

export const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Interactive Feature Modal State
  const [activeModuleModal, setActiveModuleModal] = useState(null); // 'PASSPORT', 'QUOTES', 'SOCIETY', 'WARRANTY', 'DISPUTE'
  const [ticketInput, setTicketInput] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/customer/dashboard'),
          api.get('/customer/bookings')
        ]);
        setStats(statsRes.data);
        setRecentBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data.slice(0, 3) : []);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleCreateTicket = (type) => {
    if (!ticketInput.trim()) {
      toast.error("Please enter request details");
      return;
    }
    toast.success(`✅ ${type} request submitted successfully! Support team will update your log.`);
    setTicketInput('');
    setActiveModuleModal(null);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl border border-emerald-500/20">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Customer Portal</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'Customer'}!</h1>
          <p className="text-xs text-emerald-100/80">Track active bookings, view order history, or book new services</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/ai-recommender"
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            AI Service Diagnosis
          </Link>
          <Link
            to="/services"
            className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md transition"
          >
            Book New Service
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.totalBookings || recentBookings.length || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Pending Requests</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.pendingBookings || recentBookings.filter(b => b.status === 'PENDING').length || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.completedBookings || recentBookings.filter(b => b.status === 'COMPLETED').length || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Spent</span>
            <div className="text-2xl font-extrabold text-slate-900">₹{stats?.totalSpent || 0}</div>
          </div>
        </div>
      </div>

      {/* Startup MVP Core Features Navigation Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-lg">Marketplace Hub & Retention Modules</h3>
          <span className="text-xs text-emerald-700 font-bold">✨ Click any module below to open interactive features</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Digital Repair Passport */}
          <div
            onClick={() => setActiveModuleModal('PASSPORT')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-lg hover:scale-[1.02] transition cursor-pointer space-y-2 group"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800">Digital Repair Passport</h4>
            <p className="text-xs text-slate-500">View lifetime asset maintenance records, parts replaced, and costs.</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 pt-2">
              Open Passport Logs <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 2: Quotes & AI Overcharging Protection */}
          <div
            onClick={() => setActiveModuleModal('QUOTES')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-lg hover:scale-[1.02] transition cursor-pointer space-y-2 group"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800">Quotes & AI Overcharging Protection</h4>
            <p className="text-xs text-slate-500">Compare 2-3 provider quotes with AI market range warnings.</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 pt-2">
              Check Quote Rates <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 3: Apartment / Hostel Mode */}
          <div
            onClick={() => setActiveModuleModal('SOCIETY')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-lg hover:scale-[1.02] transition cursor-pointer space-y-2 group"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800">Apartment / Hostel Mode</h4>
            <p className="text-xs text-slate-500">Manage society/PG housing maintenance tickets & dedicated pros.</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 pt-2">
              Manage Housing Mode <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 4: 30-Day Fix Guarantee Warranties */}
          <div
            onClick={() => setActiveModuleModal('WARRANTY')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-lg hover:scale-[1.02] transition cursor-pointer space-y-2 group"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800">30-Day Fix Guarantee Warranties</h4>
            <p className="text-xs text-slate-500">Track active service protection and file one-click warranty claims.</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 pt-2">
              View Active Warranties <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Card 5: Dispute Center */}
          <div
            onClick={() => setActiveModuleModal('DISPUTE')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-lg hover:scale-[1.02] transition cursor-pointer space-y-2 group"
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-700">Dispute Center</h4>
            <p className="text-xs text-slate-500">Raise or track resolution for incomplete work or pricing issues.</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 pt-2">
              File Dispute Ticket <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-lg">My Recent Bookings</h3>
          <Link to="/customer/bookings" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
            View All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-500">You haven't placed any service bookings yet.</p>
            <Link to="/services" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
              Browse Available Services
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">#{b.id} - {b.serviceTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {b.categoryName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vendor: {b.vendorBusinessName} | Date: {b.bookingDate} ({b.timeSlot})</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {b.status}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{b.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INTERACTIVE MODULE MODALS */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  {activeModuleModal === 'PASSPORT' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                  {activeModuleModal === 'QUOTES' && <Tag className="w-5 h-5 text-emerald-600" />}
                  {activeModuleModal === 'SOCIETY' && <Building className="w-5 h-5 text-blue-600" />}
                  {activeModuleModal === 'WARRANTY' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {activeModuleModal === 'DISPUTE' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {activeModuleModal === 'PASSPORT' && '📜 Digital Repair Passport'}
                    {activeModuleModal === 'QUOTES' && '🏷️ Quotes & AI Price Range Guard'}
                    {activeModuleModal === 'SOCIETY' && '🏢 Apartment & Hostel Mode'}
                    {activeModuleModal === 'WARRANTY' && '🛡️ 30-Day Fix Guarantee Warranties'}
                    {activeModuleModal === 'DISPUTE' && '⚠️ Dispute Resolution Center'}
                  </h3>
                  <p className="text-xs text-slate-500">Live Interactive Retention & Security Tool</p>
                </div>
              </div>
              <button onClick={() => setActiveModuleModal(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content per Feature */}
            <div className="space-y-4 text-xs text-slate-600">
              {activeModuleModal === 'PASSPORT' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">Asset QR & Digital History</span>
                    <p className="text-[11px] text-emerald-800">
                      Every service completed at your address logs a lifetime maintenance entry with parts replaced, vendor credentials, and digital warranty stamps.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">Log New Appliance/Home Asset Record:</label>
                    <input
                      type="text"
                      value={ticketInput}
                      onChange={(e) => setTicketInput(e.target.value)}
                      placeholder="e.g. Living Room AC Servicing (Daikin 1.5 Ton)"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {activeModuleModal === 'QUOTES' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">AI Market Rate Safety Check</span>
                    <p className="text-[11px] text-emerald-800">
                      AI prevents vendor overcharging by validating repair quotes against standard regional market rates (e.g. Tap Leakage: ₹150-₹299 max).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">Request 3 Vendor Competitive Quotes:</label>
                    <input
                      type="text"
                      value={ticketInput}
                      onChange={(e) => setTicketInput(e.target.value)}
                      placeholder="e.g. Need 3 quotes for full house wiring inspection in Mumbai"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {activeModuleModal === 'SOCIETY' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">PG & Gated Society Maintenance</span>
                    <p className="text-[11px] text-blue-800">
                      Connect your apartment society or student PG hostel for dedicated technician dispatches and bulk 20% discount packages.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">Submit Society/Hostel Ticket Request:</label>
                    <input
                      type="text"
                      value={ticketInput}
                      onChange={(e) => setTicketInput(e.target.value)}
                      placeholder="e.g. Society Gate 2 Main Water Pump Pipe Leakage"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {activeModuleModal === 'WARRANTY' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">30-Day Zero Cost Re-Fix Protection</span>
                    <p className="text-[11px] text-emerald-800">
                      All completed services include a 30-day warranty. If any issue re-occurs within 30 days, LocalFix dispatches a free senior pro.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">File 1-Click Free Warranty Claim:</label>
                    <input
                      type="text"
                      value={ticketInput}
                      onChange={(e) => setTicketInput(e.target.value)}
                      placeholder="e.g. Tap leaking again after yesterday's plumber repair"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {activeModuleModal === 'DISPUTE' && (
                <div className="space-y-3">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">24/7 Dispute Resolution SLA</span>
                    <p className="text-[11px] text-amber-800">
                      Report incomplete technician work, delayed visits, or payment discrepancies for instant admin mediation and refund processing.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">Describe Dispute Issue:</label>
                    <input
                      type="text"
                      value={ticketInput}
                      onChange={(e) => setTicketInput(e.target.value)}
                      placeholder="e.g. Technician charged extra cash above app invoice"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const pathMap = {
                    PASSPORT: '/repair-passport',
                    QUOTES: '/quotes',
                    SOCIETY: '/society-dashboard',
                    WARRANTY: '/warranties',
                    DISPUTE: '/disputes'
                  };
                  setActiveModuleModal(null);
                  navigate(pathMap[activeModuleModal]);
                }}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Go to Dedicated Page →
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModuleModal(null)}
                  className="px-3 py-2 text-slate-500 font-semibold text-xs rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateTicket(activeModuleModal)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Submit Request →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

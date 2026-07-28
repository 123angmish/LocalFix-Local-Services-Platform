import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle2, IndianRupee, ArrowRight, Wrench, Sparkles } from 'lucide-react';

export const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/customer/dashboard'),
          api.get('/customer/bookings')
        ]);
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-900 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Customer Portal</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-indigo-100/80">Track active bookings, view order history, or book new services</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/ai-recommender"
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4" />
            AI Service Recommender
          </Link>
          <Link
            to="/services"
            className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition"
          >
            Book New Service
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.totalBookings || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Pending Requests</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.pendingBookings || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats?.completedBookings || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Spent</span>
            <div className="text-2xl font-extrabold text-slate-900">₹{stats?.totalSpent || 0}</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-lg">My Recent Bookings</h3>
          <Link to="/customer/bookings" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            View All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-slate-500">You haven't placed any service bookings yet.</p>
            <Link to="/services" className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
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
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                      {b.categoryName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vendor: {b.vendorBusinessName} | Date: {b.bookingDate} ({b.timeSlot})</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
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
    </div>
  );
};

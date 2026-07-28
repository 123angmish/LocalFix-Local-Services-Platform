import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar, Clock, CheckCircle2, IndianRupee, Star, Wrench, Layers, ArrowRight } from 'lucide-react';

export const VendorDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/vendor/dashboard'),
          api.get('/vendor/bookings')
        ]);
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 4));
      } catch (err) {
        console.error("Vendor dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, []);

  const chartData = [
    { name: 'Mon', earnings: 450 },
    { name: 'Tue', earnings: 890 },
    { name: 'Wed', earnings: 1200 },
    { name: 'Thu', earnings: 600 },
    { name: 'Fri', earnings: 1500 },
    { name: 'Sat', earnings: 2100 },
    { name: 'Sun', earnings: 1800 },
  ];

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Vendor Management Portal</span>
          <h1 className="text-3xl font-extrabold tracking-tight">{user?.businessName || user?.name}</h1>
          <p className="text-xs text-slate-300">Manage incoming service bookings, service offerings, and track revenue</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/vendor/services"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Wrench className="w-4 h-4" />
            Manage Services
          </Link>
          <Link
            to="/vendor/bookings"
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            Bookings Queue
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalBookings || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-amber-600 font-medium">Pending Approvals</span>
          <div className="text-2xl font-extrabold text-amber-600">{stats?.pendingBookings || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-emerald-600 font-medium">Completed Jobs</span>
          <div className="text-2xl font-extrabold text-emerald-600">{stats?.completedBookings || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
          <div className="text-2xl font-extrabold text-slate-900">₹{stats?.totalEarnings || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Rating ({stats?.totalReviews || 0} reviews)</span>
          <div className="text-2xl font-extrabold text-amber-500 flex items-center gap-1">
            <Star className="w-5 h-5 fill-current" />
            <span>{stats?.averageRating || 5.0}</span>
          </div>
        </div>
      </div>

      {/* Chart & Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Weekly Revenue Overview (₹)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(val) => `₹${val}`} />
                <Bar dataKey="earnings" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Recent Incoming Bookings</h3>
            <Link to="/vendor/bookings" className="text-xs text-indigo-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No incoming bookings currently.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-slate-900 font-bold">{b.serviceTitle}</strong>
                    <span className="text-indigo-600 font-extrabold">₹{b.totalAmount}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Customer: {b.customerName} ({b.customerPhone || b.customerEmail})</p>
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-slate-400">{b.bookingDate} • {b.timeSlot}</span>
                    <span className="font-bold text-indigo-600">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

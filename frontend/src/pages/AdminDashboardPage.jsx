import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Users, Store, Calendar, Layers, IndianRupee, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, vendorsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/vendors')
        ]);
        setStats(statsRes.data);
        setVendors(vendorsRes.data.filter(v => !v.approved));
      } catch (err) {
        console.error("Admin dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Super Admin Console</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Dashboard</h1>
          <p className="text-xs text-slate-400">Monitor system performance, review vendor registrations, and manage service categories</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/vendors"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Store className="w-4 h-4" />
            Vendor Approvals ({stats?.pendingVendorApprovals || 0})
          </Link>
          <Link
            to="/admin/categories"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Users</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Vendors</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalVendors || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-amber-600 font-medium">Pending Vendors</span>
          <div className="text-2xl font-extrabold text-amber-600">{stats?.pendingVendorApprovals || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalBookings || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Active Services</span>
          <div className="text-2xl font-extrabold text-slate-900">{stats?.totalServices || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Platform GMV</span>
          <div className="text-2xl font-extrabold text-emerald-600">₹{stats?.totalRevenue || 0}</div>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Pending Vendor Approvals Queue
          </h3>
          <Link to="/admin/vendors" className="text-xs font-semibold text-indigo-600 hover:underline">
            View All Vendors
          </Link>
        </div>

        {vendors.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No pending vendor applications waiting for review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Owner Name</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{v.businessName}</td>
                    <td className="p-3 text-slate-700">{v.user?.name}</td>
                    <td className="p-3 text-slate-600">{v.city}</td>
                    <td className="p-3 text-slate-500">{v.user?.email}</td>
                    <td className="p-3 text-right">
                      <Link
                        to="/admin/vendors"
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[11px]"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

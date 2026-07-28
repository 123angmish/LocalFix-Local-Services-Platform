import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [roleType, setRoleType] = useState('CUSTOMER'); // CUSTOMER or VENDOR
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'VENDOR') navigate('/vendor/dashboard');
      else navigate('/customer/dashboard');
    } catch (err) {
      // Handled in auth context toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to LocalFix</h2>
          <p className="text-xs text-slate-500">Access your account to manage bookings & services</p>
        </div>

        {/* 2 Options Tab: Customer / Vendor */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRoleType('CUSTOMER')}
            className={`py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
              roleType === 'CUSTOMER'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Sign in as Customer
          </button>
          <button
            type="button"
            onClick={() => setRoleType('VENDOR')}
            className={`py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
              roleType === 'VENDOR'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Sign in as Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                autoComplete="new-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm shadow-indigo-200 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : `Sign in as ${roleType === 'CUSTOMER' ? 'Customer' : 'Vendor'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to={`/register?type=${roleType.toLowerCase()}`} className="font-bold text-indigo-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

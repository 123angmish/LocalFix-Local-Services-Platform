import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
          <h2 className="text-lg font-bold text-slate-700">Page Not Found</h2>
          <p className="text-xs text-slate-500">The page you are looking for does not exist or has been moved.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

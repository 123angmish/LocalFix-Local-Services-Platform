import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Check, X, Play, CheckCircle, Calendar, Phone, MapPin, Filter } from 'lucide-react';

export const VendorBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/vendor/bookings');
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load vendor bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [otpModal, setOtpModal] = useState(null); // { bookingId, targetAction }
  const [inputOtp, setInputOtp] = useState('');

  const handleStatusChange = async (bookingId, action, otpVal = '') => {
    try {
      let url = `/vendor/bookings/${bookingId}/${action}`;
      if (otpVal) {
        url += `?otp=${encodeURIComponent(otpVal)}`;
      }
      await api.patch(url);
      toast.success(`Booking updated to ${action.replace('-', ' ')}!`);
      setOtpModal(null);
      setInputOtp('');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status. Check OTP code.");
    }
  };

  const openOtpModal = (bookingId, targetAction) => {
    setOtpModal({ bookingId, targetAction });
    setInputOtp('');
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Customer Bookings</h1>
          <p className="text-sm text-slate-600">Accept, reject, start work, or complete service requests with OTP verification</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-sm text-slate-500">No bookings match the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 text-base">Booking #{b.id}</span>
                  <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                    {b.categoryName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'IN_PROGRESS' ? 'bg-teal-100 text-teal-800' :
                    b.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">₹{b.totalAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 font-medium">Customer Details:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{b.customerName}</p>
                  <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> {b.customerPhone || b.customerEmail}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Schedule & Location:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{b.bookingDate} ({b.timeSlot})</p>
                  <p className="text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {b.address}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Notes & Payment:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">Payment: {b.paymentMethod} ({b.paymentStatus})</p>
                  {b.notes && <p className="text-slate-500 italic">"{b.notes}"</p>}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-end gap-2">
                {b.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(b.id, 'reject')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(b.id, 'accept')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept Booking
                    </button>
                  </>
                )}

                {b.status === 'ACCEPTED' && (
                  <button
                    onClick={() => openOtpModal(b.id, 'in-progress')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Start Job (Enter OTP)
                  </button>
                )}

                {b.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => openOtpModal(b.id, 'complete')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Complete Job (Enter OTP)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTP Input Modal */}
      {otpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Enter 4-Digit Verification OTP
              </h3>
              <button onClick={() => setOtpModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Ask customer for their 4-digit verification code shown on their booking card to authorize {otpModal.targetAction.replace('-', ' ')}.
            </p>

            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 4829"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              className="w-full text-center text-2xl font-mono tracking-widest py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOtpModal(null)}
                className="px-4 py-2 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(otpModal.bookingId, otpModal.targetAction, inputOtp)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Verify & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

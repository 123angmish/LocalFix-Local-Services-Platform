import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Star, X, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export const CustomerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/customer/bookings');
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load customer bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.patch(`/customer/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        bookingId: selectedBooking.id,
        rating,
        comment
      });
      toast.success("Review submitted! Thank you for your feedback.");
      setSelectedBooking(null);
      setComment('');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Service Bookings</h1>
        <p className="text-sm text-slate-600">Track current status, cancel bookings, or add reviews for completed services</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-sm text-slate-500">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 text-base">Booking #{b.id}</span>
                  <span className="px-3 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {b.categoryName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-800' :
                    b.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                    b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">₹{b.totalAmount}</span>
                </div>
              </div>

              {/* Visual Status Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className={b.status === 'PENDING' ? 'text-amber-600' : 'text-slate-400'}>1. Placed</span>
                  <span className={b.status === 'ACCEPTED' ? 'text-blue-600' : 'text-slate-400'}>2. Confirmed</span>
                  <span className={b.status === 'IN_PROGRESS' ? 'text-indigo-600 font-extrabold animate-pulse' : 'text-slate-400'}>3. Technician Arrived</span>
                  <span className={b.status === 'COMPLETED' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>4. Work Done</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div className={`h-full transition-all duration-500 ${
                    b.status === 'COMPLETED' ? 'w-full bg-emerald-500' :
                    b.status === 'IN_PROGRESS' ? 'w-3/4 bg-indigo-600' :
                    b.status === 'ACCEPTED' ? 'w-1/2 bg-blue-500' :
                    b.status === 'PENDING' ? 'w-1/4 bg-amber-500' :
                    'w-full bg-rose-500'
                  }`}></div>
                </div>

                {/* OTP Verification Box */}
                {b.verificationCode && (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS') && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">Start/Completion OTP</span>
                      <p className="text-xs text-slate-600">Share this code with technician upon arrival</p>
                    </div>
                    <span className="text-xl font-mono font-black tracking-widest bg-white px-3 py-1 rounded-lg border border-indigo-300 text-indigo-900 shadow-sm">
                      {b.verificationCode}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 font-medium">Service Details:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{b.serviceTitle}</p>
                  <p className="text-slate-500">Provider: <span className="font-semibold text-slate-800">{b.vendorBusinessName}</span> ({b.vendorPhone})</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Schedule & Address:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{b.bookingDate} ({b.timeSlot})</p>
                  <p className="text-slate-500 truncate">{b.address}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Payment Summary:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">Method: {b.paymentMethod} ({b.paymentStatus})</p>
                  {b.promoCode && <p className="text-emerald-600 font-semibold">Coupon: {b.promoCode} (-₹{b.discountAmount || 0})</p>}
                  {b.notes && <p className="text-slate-500 italic truncate">"{b.notes}"</p>}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-3">
                  {(b.status === 'PENDING' || b.status === 'ACCEPTED') && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {b.status === 'COMPLETED' && !b.reviewed && (
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                      Write Review
                    </button>
                  )}

                  {b.status === 'COMPLETED' && b.reviewed && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Reviewed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Review Service #{selectedBooking.id}
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition ${
                        rating >= star ? 'text-amber-400 bg-amber-50' : 'text-slate-300 bg-slate-100'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Your Feedback Comment</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience with the service provider..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

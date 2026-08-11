import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Star, X, CheckCircle, AlertCircle, MessageSquare, CreditCard, RefreshCw, ShieldCheck, Lock, QrCode, Smartphone, Banknote, ShieldAlert } from 'lucide-react';

export const CustomerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Real App Payment Gateway Modal State
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CASH, CARD, NETBANKING
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState('GPay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

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

  const handleRegenerateOtp = async (bookingId) => {
    try {
      await api.patch(`/customer/bookings/${bookingId}/regenerate-otp`);
      toast.success("New 4-digit OTP generated & updated!");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to regenerate OTP");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'UPI' && !upiId.trim() && upiApp === 'VPA') {
      toast.error("Please enter a valid UPI VPA ID (e.g. name@upi)");
      return;
    }

    if (paymentMethod === 'CARD' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      toast.error("Please fill in complete Card details");
      return;
    }

    setSubmittingPayment(true);
    try {
      await api.post('/payments/dummy', {
        bookingId: paymentBooking.id,
        method: paymentMethod
      });
      toast.success(`🎉 Payment of ₹${paymentBooking.totalAmount} completed via ${paymentMethod === 'CASH' ? 'Cash on Service Delivery' : paymentMethod}!`);
      setPaymentBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process payment");
    } finally {
      setSubmittingPayment(false);
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
        <p className="text-sm text-slate-600">Track status, complete payments via UPI/Card/Cash upon vendor acceptance, share unique OTPs, or review services</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-sm text-slate-500">You don't have any active bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
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
                    {b.status === 'ACCEPTED' ? 'ACCEPTED BY VENDOR' : b.status}
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">₹{b.totalAmount}</span>
                </div>
              </div>

              {/* Visual Status Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className={b.status === 'PENDING' ? 'text-amber-600' : 'text-slate-400'}>1. Placed</span>
                  <span className={b.status === 'ACCEPTED' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>2. Accepted by Vendor</span>
                  <span className={b.status === 'IN_PROGRESS' ? 'text-teal-600 font-extrabold animate-pulse' : 'text-slate-400'}>3. Work In Progress</span>
                  <span className={b.status === 'COMPLETED' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>4. Completed</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div className={`h-full transition-all duration-500 ${
                    b.status === 'COMPLETED' ? 'w-full bg-emerald-500' :
                    b.status === 'IN_PROGRESS' ? 'w-3/4 bg-teal-600' :
                    b.status === 'ACCEPTED' ? 'w-1/2 bg-emerald-500' :
                    b.status === 'PENDING' ? 'w-1/4 bg-amber-500' :
                    'w-full bg-rose-500'
                  }`}></div>
                </div>

                {/* Unique 4-Digit Security OTP Box */}
                {b.verificationCode && (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'PENDING') && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        Unique 4-Digit Security OTP
                      </span>
                      <p className="text-xs text-slate-600">Share this code with technician upon arrival</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-mono font-black tracking-widest bg-white px-3.5 py-1 rounded-lg border border-emerald-300 text-emerald-950 shadow-sm">
                        {b.verificationCode}
                      </span>
                      <button
                        onClick={() => handleRegenerateOtp(b.id)}
                        className="p-2 bg-white text-emerald-600 hover:bg-emerald-100 rounded-lg border border-emerald-200 shadow-sm transition"
                        title="Generate Fresh Unique 4-Digit OTP"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                  <span className="text-slate-400 font-medium">Payment Status:</span>
                  <div className="mt-0.5 flex items-center gap-1.5 font-bold">
                    <span className={b.paymentStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}>
                      {b.paymentStatus === 'SUCCESS' ? '✅ Paid' : '⏳ Payment Pending'}
                    </span>
                    <span className="text-slate-400 font-normal">({b.paymentMethod || 'UPI'})</span>
                  </div>
                  {b.promoCode && <p className="text-emerald-600 font-semibold">Coupon: {b.promoCode} (-₹{b.discountAmount || 0})</p>}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-[11px] text-slate-400">
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-2 flex-wrap w-full sm:w-auto justify-end">
                  {/* Payment Button when Vendor Accepts */}
                  {b.paymentStatus !== 'SUCCESS' && (b.status === 'ACCEPTED' || b.status === 'PENDING') && (
                    <button
                      onClick={() => setPaymentBooking(b)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay ₹{b.totalAmount} Now
                    </button>
                  )}

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
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
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

      {/* Real App Production Payment Gateway Modal */}
      {paymentBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl space-y-5 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">256-Bit SSL Encrypted</span>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  LocalFix Secure Checkout
                </h3>
                <p className="text-xs text-slate-500">Booking #{paymentBooking.id} • {paymentBooking.serviceTitle}</p>
              </div>
              <button onClick={() => setPaymentBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-inner">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Service Charge</p>
                  <p className="text-2xl font-black text-emerald-400">₹{paymentBooking.totalAmount}</p>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">No Hidden Fees</span>
              </div>

              {/* Payment Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Choose Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2.5 px-1 rounded-xl border text-center font-extrabold text-xs transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`py-2.5 px-1 rounded-xl border text-center font-extrabold text-xs transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'CASH'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    Pay Cash
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2.5 px-1 rounded-xl border text-center font-extrabold text-xs transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'CARD'
                        ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cards
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`py-2.5 px-1 rounded-xl border text-center font-extrabold text-xs transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    NetBanking
                  </button>
                </div>
              </div>

              {/* UPI Tab Content */}
              {paymentMethod === 'UPI' && (
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                  <div className="flex gap-2">
                    {['GPay', 'PhonePe', 'Paytm', 'VPA'].map((app) => (
                      <button
                        type="button"
                        key={app}
                        onClick={() => setUpiApp(app)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                          upiApp === app
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {app === 'GPay' ? '⚡ Google Pay' : app === 'PhonePe' ? '🟣 PhonePe' : app === 'Paytm' ? '🟦 Paytm' : '🆔 UPI VPA'}
                      </button>
                    ))}
                  </div>

                  {upiApp === 'VPA' ? (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Enter UPI ID / VPA</label>
                      <input
                        type="text"
                        placeholder="e.g. mobileNumber@okaxis or name@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-xl border border-emerald-100 text-center space-y-2">
                      <div className="inline-block p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=localfix@okaxis&pn=LocalFixServices&am=${paymentBooking.totalAmount}`}
                          alt="Instant UPI QR Code"
                          className="w-32 h-32 mx-auto rounded"
                        />
                      </div>
                      <p className="text-[11px] font-bold text-slate-800">Scan QR Code using {upiApp}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Cash on Delivery Content */}
              {paymentMethod === 'CASH' && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-xs text-emerald-900">Cash on Service Delivery</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Pay ₹{paymentBooking.totalAmount} in cash directly to technician upon successful completion of service work. No upfront online payment required.
                  </p>
                </div>
              )}

              {/* Card Details Content */}
              {paymentMethod === 'CARD' && (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name printed on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 XXXX XXXX 8890"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono tracking-widest"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="***"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Content */}
              {paymentMethod === 'NETBANKING' && (
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700">Select Popular Indian Bank</label>
                  <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="bg-slate-100 p-3 rounded-xl text-[11px] text-slate-600 flex items-center justify-between border border-slate-200">
                <span className="flex items-center gap-1 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-slate-700" />
                  PCI-DSS Bank Grade Encryption
                </span>
                <span className="font-bold text-slate-800">100% Refund Guarantee</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentBooking(null)}
                  className="px-4 py-2.5 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-200 transition flex items-center gap-2"
                >
                  {submittingPayment ? 'Processing Payment...' : `Confirm & Pay ₹${paymentBooking.totalAmount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
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
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
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

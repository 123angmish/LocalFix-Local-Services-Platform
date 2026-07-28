import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, CreditCard, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const timeSlots = [
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '01:30 PM - 03:00 PM',
    '03:30 PM - 05:00 PM',
    '05:30 PM - 07:00 PM'
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        toast.error("Failed to fetch service info");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    if (code === 'FIRSTFIX10') {
      const disc = Math.round(service.price * 0.10);
      setDiscountAmount(disc);
      setAppliedCode('FIRSTFIX10');
      toast.success("10% Discount Applied! (FIRSTFIX10)");
    } else if (code === 'SUPERHOME20') {
      const disc = Math.round(service.price * 0.20);
      setDiscountAmount(disc);
      setAppliedCode('SUPERHOME20');
      toast.success("20% Super Saver Applied! (SUPERHOME20)");
    } else if (code === 'WELCOME50') {
      const disc = Math.min(50, service.price);
      setDiscountAmount(disc);
      setAppliedCode('WELCOME50');
      toast.success("₹50 Welcome Voucher Applied!");
    } else {
      toast.error("Invalid coupon code. Try FIRSTFIX10 or SUPERHOME20");
    }
  };

  const removePromo = () => {
    setAppliedCode('');
    setDiscountAmount(0);
    setPromoCode('');
    toast.success("Coupon removed");
  };

  const finalTotal = Math.max(0, service ? service.price - discountAmount : 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter a valid service address");
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        serviceId: service.id,
        bookingDate,
        timeSlot,
        address,
        notes,
        paymentMethod,
        promoCode: appliedCode || null
      });

      toast.success("Booking placed successfully!");
      navigate('/customer/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!service) {
    return <div className="p-8 text-center">Service unavailable.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Complete Your Service Booking</h1>
        <p className="text-sm text-slate-600">Select date, time slot, address, and promo discounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form area */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              1. Select Date & Time Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Service Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Preferred Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              2. Address & Special Instructions
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Complete Address</label>
              <textarea
                rows={2}
                required
                placeholder="House/Flat No., Building Name, Street, Landmark, Area..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Notes for Professional (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Please bring a 15-inch pipe wrench"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              3. Payment Selection (Dummy Payment)
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {['UPI', 'CASH', 'CARD'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-3 rounded-2xl border text-center font-bold text-xs transition ${
                    paymentMethod === m
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {m === 'UPI' ? '⚡ UPI / GPay' : m === 'CASH' ? '💵 Cash on Service' : '💳 Credit/Debit Card'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 shadow-indigo-200 disabled:opacity-50"
          >
            {submitting ? 'Confirming Booking...' : `Confirm & Pay ₹${finalTotal}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Order Summary</h3>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider px-2 py-0.5 bg-indigo-50 rounded">
                {service.categoryName}
              </span>
              <h4 className="font-bold text-slate-900 text-base">{service.title}</h4>
              <p className="text-xs text-slate-500">Provided by {service.vendorBusinessName}</p>
            </div>

            {/* Promo Code Box */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-700">Have a Promo Coupon?</label>
              {appliedCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-xs text-emerald-800 font-semibold">
                  <span>🎉 {appliedCode} Applied (-₹{discountAmount})</span>
                  <button type="button" onClick={removePromo} className="text-xs text-rose-600 underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try FIRSTFIX10 or SUPERHOME20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Service Fee:</span>
                <span className="font-semibold text-slate-900">₹{service.price}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount:</span>
                  <span className="font-semibold">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Visiting Charge:</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Taxes:</span>
                <span className="font-semibold text-slate-900">₹0</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-indigo-600">₹{finalTotal}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Free cancellation up to 2 hours before scheduled slot.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

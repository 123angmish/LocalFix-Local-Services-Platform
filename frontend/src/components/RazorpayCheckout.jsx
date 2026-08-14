import React, { useState } from 'react';
import api from '../api/axios';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const RazorpayCheckout = ({ bookingId, totalAmount, onPaymentSuccess, onPaymentCancel }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // Step 1: Load Razorpay Checkout SDK script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Step 2: Request Order creation on Server Side
      const orderRes = await api.post(`/payments/create-order?bookingId=${bookingId}`);
      const { orderId, amount, currency, keyId } = orderRes.data;

      // Step 3: Configure Razorpay Checkout Dialog Options
      const options = {
        key: keyId || 'rzp_test_localfix_key',
        amount: amount,
        currency: currency || 'INR',
        name: 'LocalFix Services Platform',
        description: `Booking #${bookingId} Payment`,
        order_id: orderId.startsWith('order_') ? orderId : undefined,
        handler: async function (response) {
          setLoading(true);
          try {
            // Step 4: Server-Side HMAC-SHA256 Signature Verification
            const verifyRes = await api.post('/payments/verify', {
              bookingId: bookingId.toString(),
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'test_sig',
              method: 'RAZORPAY_ONLINE'
            });

            toast.success("Payment Verified & Booking Confirmed! 🎉");
            if (onPaymentSuccess) onPaymentSuccess(verifyRes.data);
          } catch (verifyErr) {
            toast.error("Server payment verification failed. Please contact support.");
            console.error(verifyErr);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@localfix.com',
          contact: '+919876543210'
        },
        theme: {
          color: '#059669'
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment popup cancelled.");
            setLoading(false);
            if (onPaymentCancel) onPaymentCancel();
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate Razorpay payment");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Razorpay 256-Bit SSL Secured</span>
        </div>
        <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
          Razorpay Gateway
        </span>
      </div>

      <div className="flex justify-between items-center text-sm font-bold text-slate-800 pt-1">
        <span>Total Payable Amount:</span>
        <span className="text-2xl font-black text-emerald-700">₹{totalAmount || '0'}</span>
      </div>

      <button
        onClick={handleRazorpayPayment}
        disabled={loading}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <span>Processing Payment...</span>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay Securely via Razorpay →</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-medium pt-1">
        <Lock className="w-3.5 h-3.5 text-slate-600" />
        <span>Supports UPI (GPay, PhonePe, Paytm), Debit/Credit Cards & NetBanking</span>
      </div>
    </div>
  );
};

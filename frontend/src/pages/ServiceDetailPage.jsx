import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Clock, Star, ShieldCheck, CheckCircle2, User, ArrowLeft, MessageSquare, Phone, Mail } from 'lucide-react';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [srvRes, revRes] = await Promise.all([
          api.get(`/services/${id}`),
          api.get(`/reviews/service/${id}`)
        ]);
        setService(srvRes.data);
        setReviews(revRes.data);
      } catch (err) {
        console.error("Failed to load service detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Service Not Found</h2>
        <Link to="/services" className="text-indigo-600 font-semibold text-sm">
          ← Back to all services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      {/* Main Header Banner Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-wider">
              {service.categoryName}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{service.title}</h1>
            <p className="text-sm font-medium text-slate-500">
              Offered by <span className="text-indigo-600 font-bold">{service.vendorBusinessName}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right min-w-[180px]">
            <span className="text-xs text-slate-500 font-medium">Standard Service Fee</span>
            <div className="text-3xl font-extrabold text-slate-900">₹{service.price}</div>
            <Link
              to={`/book/${service.id}`}
              className="mt-3 block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm text-center shadow-indigo-200 transition"
            >
              Book Service Now
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>Location: <strong>{service.city}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Estimated Time: <strong>{service.durationMinutes || 60} mins</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span>Vendor Rating: <strong>{service.vendorRating || 5.0}★</strong> ({service.vendorTotalReviews || 1} reviews)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified Local Vendor</span>
          </div>
        </div>
      </div>

      {/* Description & Included Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Service Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>

            <h4 className="text-sm font-bold text-slate-900 pt-2">Service Guarantee:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% On-time Arrival Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>30-Day Service Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Clean & Trained Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Transparent Cash/UPI/Card Payment</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Customer Reviews ({reviews.length})
              </h3>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No reviews yet for this service. Book first to share your experience!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {rev.customerName?.charAt(0) || 'C'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vendor Contact & Details Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Vendor Contact Info</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {service.vendorBusinessName?.charAt(0) || 'V'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{service.vendorBusinessName}</h4>
                <span className="text-xs text-slate-500">{service.vendorCity}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Phone Number</span>
                  <span className="font-bold text-slate-900">{service.vendorPhone || '+91 9876543210'}</span>
                </div>
              </div>

              {service.vendorEmail && (
                <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email</span>
                    <span className="font-bold text-slate-900">{service.vendorEmail}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Overall Rating:</span>
                <strong className="text-amber-500">{service.vendorRating || 5.0} ★</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Reviews:</span>
                <strong className="text-slate-800">{service.vendorTotalReviews || 1}</strong>
              </div>
            </div>

            <Link
              to={`/book/${service.id}`}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md text-center block shadow-indigo-200 transition"
            >
              Proceed to Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoutes';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { BookingPage } from './pages/BookingPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { CustomerBookingsPage } from './pages/CustomerBookingsPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { VendorServicesPage } from './pages/VendorServicesPage';
import { VendorBookingsPage } from './pages/VendorBookingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminVendorsPage } from './pages/AdminVendorsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AIRecommenderPage } from './pages/AIRecommenderPage';
import { RepairPassportPage } from './pages/RepairPassportPage';
import { WarrantyPage } from './pages/WarrantyPage';
import { DisputePage } from './pages/DisputePage';
import { SocietyDashboardPage } from './pages/SocietyDashboardPage';
import { QuotesComparisonPage } from './pages/QuotesComparisonPage';
import { ProviderSaaSPage } from './pages/ProviderSaaSPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-['Inter',sans-serif]">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/ai-recommender" element={<AIRecommenderPage />} />

          {/* Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
            <Route path="/book/:serviceId" element={<BookingPage />} />
            <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
            <Route path="/repair-passport" element={<RepairPassportPage />} />
            <Route path="/warranties" element={<WarrantyPage />} />
            <Route path="/disputes" element={<DisputePage />} />
            <Route path="/society-dashboard" element={<SocietyDashboardPage />} />
            <Route path="/quotes" element={<QuotesComparisonPage />} />
          </Route>

          {/* Vendor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['VENDOR', 'PROVIDER', 'ADMIN']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
            <Route path="/vendor/services" element={<VendorServicesPage />} />
            <Route path="/vendor/bookings" element={<VendorBookingsPage />} />
            <Route path="/vendor/crm" element={<ProviderSaaSPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/vendors" element={<AdminVendorsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

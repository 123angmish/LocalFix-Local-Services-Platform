# 🚀 LocalFix — Enterprise AI-Powered Trusted Local Services Platform (Startup MVP)

![LocalFix Platform](https://img.shields.io/badge/Status-Live%20Production-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Java%2021%20%7C%20Spring%20Boot%203.2%20%7C%20React%2018%20%7C%20Vite%205-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-BCrypt%2012%20%7C%20HMAC--SHA256%20JWT%20%7C%20Razorpay%20HMAC-green?style=for-the-badge)
![Deployment](https://img.shields.io/badge/CDN-Netlify%20%7C%20Render%20Cloud-orange?style=for-the-badge)

**LocalFix** is an enterprise-grade, full-stack startup MVP built as an **AI-Powered Local Services & Home Maintenance Marketplace** (similar to a local version of Urban Company). It connects customers who need local services with verified vendors/service providers across trades including **Electrician, Plumber, AC Repair, Appliance Repair, Carpenter, Painter, Cleaning, Beautician, Home Salon, Tutor, Mechanic, Laptop Repair, Mobile Repair, Pest Control, Packers & Movers**, and more.

> **Tagline**: *"Show us what's broken. We'll get it fixed."*

---

## 🌐 Live Production Deployments

| Component | Cloud Host | Live URL |
| :--- | :--- | :--- |
| **Frontend Web Application** | **Netlify CDN** | 🔗 [candid-kitten-e6980d.netlify.app](https://candid-kitten-e6980d.netlify.app) |
| **Backend REST API Server** | **Render Cloud** | 🔗 [localfix-backend-gfu0.onrender.com/api](https://localfix-backend-gfu0.onrender.com/api) |
| **Source Code Repository** | **GitHub** | 🔗 [github.com/123angmish/LocalFix-Local-Services-Platform](https://github.com/123angmish/LocalFix-Local-Services-Platform) |

---

## 🌟 Master Core Features & Startup Differentiators

### 1. 🎨 Urban Company Style Landing Page & Plus Jakarta Sans UI
- **Hero Headline**: *"Find trusted local professionals near you."*
- **Subheading**: *"Book reliable local service providers for home, repair, beauty, maintenance and more."*
- **Primary & Secondary CTAs**: **`Find a Service`** and **`Become a Service Provider`**.
- **Popular Categories**: 14 curated category badges (Electrician, Plumber, AC Repair, Appliance Repair, Beautician, Cleaner, Carpenter, Painter, Tutor, Mechanic, Laptop/Mobile Repair, Pest Control, Movers).
- **Glassmorphic Design System**: Plus Jakarta Sans typography, ambient mesh background gradients, rounded 3xl cards, soft shadows, hover transitions, and custom emerald scrollbars.

### 2. 🔒 Mandatory Registration Guard & Role Onboarding
- **Registration First Validation**: Sign In requires a registered account. Unregistered sign-in attempts trigger an instant **`⚠️ Account Not Registered!`** modal with a 1-click **`✨ Register & Create Account Now →`** redirect.
- **Onboarding Gateway**: Choose between **CUSTOMER** ("I want to book services") vs **SERVICE PROVIDER** ("I want to offer services"). Role-based route protection (`CUSTOMER`, `VENDOR`, `ADMIN`).

### 3. 🔑 Multi-Channel Authentication (Google OAuth & Email OTP)
- **Google Sign-In**: Interactive Google Account Selector Modal on Login & Register.
- **Passwordless Email OTP**: Single-use 6-digit OTP code dispatch (`POST /api/auth/otp/send`, `POST /api/auth/otp/verify`) with 5-minute expiration, resend cooldown, and rate limiting.
- **Spring Security JWT**: Short-lived access tokens and refresh tokens with HMAC-SHA256 server verification.

### 4. 📍 Real Geolocation & Location-Based Search
- **Browser Geolocation**: Integrated `navigator.geolocation` for instant latitude/longitude and city reverse geocoding (*Vanasthali, Mumbai, Delhi NCR, etc.*).
- **Location Filters**: Filter & sort by distance, category, rating, price range, and availability.

### 5. 💳 Real Razorpay Test Mode & Server-Side Verification
- **Server Order Creation**: `POST /api/payments/create-order` creates server-controlled Razorpay orders.
- **Razorpay SDK Checkout**: Support for Google Pay, PhonePe, Paytm, BHIM, Cards & Netbanking.
- **HMAC-SHA256 Verification**: `POST /api/payments/verify` performs server-side signature verification before confirming booking status to `CONFIRMED/PAID`.

### 6. 📊 Clickable Vendor Metrics & Profile Editor
- **Clean 0-State**: New vendor profiles start at 0 Bookings & ₹0 Revenue until real customer bookings are created.
- **Interactive Metric Cards**: Clicking any of the 5 stats cards (*Total Bookings, Pending Approvals, Completed Jobs, Total Revenue, Rating*) opens a real-time breakdown modal.
- **1-Click Profile Editor**: Edit Business/Shop Name (*Apex Barber Salon, etc.*), Owner Name, Phone, City, and Description directly on the banner.

### 7. 🌐 Market Vendor Directory Tab
- Vendors can switch between **`My Registered Services`** and **`Browse All Market Vendor Services`** to inspect competitor offerings, pricing benchmarks, and vendor ratings across the platform.

### 8. 📸 Photo Upload & HD Live Preview
- Device camera/gallery file picker supporting images up to 10MB (`accept="image/*"`), live preview container, remove/change controls, and preset work photo samples.

### 9. 🛍️ Marketplace Hub & Retention Modules
- **Digital Repair Passport**: Lifetime asset QR logs, parts replaced, and maintenance history.
- **Quotes & AI Overcharging Protection**: Compare 2-3 quotes with AI market range warnings.
- **Apartment / Hostel Mode**: PG & Society housing maintenance ticket logger.
- **30-Day Fix Warranties**: 1-click free re-service claim logger.
- **Dispute Center**: 24/7 resolution SLA logger for incomplete work or overcharging.

### 10. 📄 Netlify SPA Single-Page Routing
- `frontend/public/_redirects` contains `/* /index.html 200` to prevent 404 errors on direct URL refreshes.

---

## 💳 Payment Gateway Options

- ⚡ **Razorpay Test Mode Checkout** (Google Pay, PhonePe, Paytm, BHIM, UPI VPA)
- 💵 **Cash on Service Delivery (COD)** (Pay technician after inspection and work completion)
- 💳 **Credit / Debit Cards** (PCI-DSS Bank Grade 256-bit SSL encrypted)
- 🎟️ **Instant Coupons** (`FIRSTFIX10`, `SUPERHOME20`, `WELCOME50`)

---

## 🔒 Enterprise Security & Data Protection

1. **Password Encryption**: All credentials salted and hashed with **BCrypt (Strength 12)**.
2. **Stateless JWT Security**: HMAC-SHA256 token verification with `JwtAuthenticationFilter`.
3. **Role-Based Authorization**: Fine-grained `@EnableMethodSecurity` restricting endpoints across `ROLE_CUSTOMER`, `ROLE_VENDOR`, and `ROLE_ADMIN`.
4. **Server Payment Signature Verification**: Razorpay HMAC-SHA256 signature verification in `PaymentService.java`.
5. **Database Integrity**: PostgreSQL / H2 Flyway schema migrations.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2.3, Spring Security, Spring Data JPA, Hibernate, Flyway Migrations |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons, Axios, React Hot Toast, React Router v6 |
| **Database** | PostgreSQL / H2 Relational Database Engine |
| **Deployments** | Render Cloud (Backend API), Netlify CDN (Frontend SPA), GitHub CI/CD |

---

## 🚀 Local Development Setup

### 1. Backend (Spring Boot):
```bash
cd backend
mvn spring-boot:run
```
*(Backend running at `http://localhost:8080/api`)*

### 2. Frontend (Vite + React):
```bash
cd frontend
npm install
npm run dev
```
*(Frontend running at `http://localhost:5173`)*

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@localfix.com` | `Admin@123` | `/admin/dashboard` |
| **Customer** | `customer@localfix.com` | `Customer@123` | `/customer/dashboard` |
| **Vendor** | `vendor@localfix.com` | `Vendor@123` | `/vendor/dashboard` & `/vendor/services` |

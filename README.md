# 🚀 LocalFix — Enterprise AI-Powered Trusted Local Services Platform (Startup MVP)

![LocalFix Platform](https://img.shields.io/badge/Status-Live%20Production-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Java%2021%20%7C%20Spring%20Boot%203.2%20%7C%20React%2018%20%7C%20Vite%205-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-BCrypt%2012%20%7C%20HMAC--SHA256%20JWT%20%7C%20PostgreSQL-green?style=for-the-badge)

**LocalFix** is a production-grade, full-stack startup MVP built as an **AI-Powered Local Services & Home Maintenance Marketplace**. It diagnoses repair issues using Multimodal LLM AI engines, detects overcharging fraud, matches verified local professionals, logs before/after parts proof, provides 30-day service warranties, and maintains permanent digital **Repair Passports** for home appliances.

> **Tagline**: *"Show us what's broken. We'll get it fixed."*

---

## 🌐 Live Production Deployments

| Component | Cloud Host | Live URL |
| :--- | :--- | :--- |
| **Frontend Web Application** | **Netlify CDN** | 🔗 [candid-kitten-e6980d.netlify.app](https://candid-kitten-e6980d.netlify.app) |
| **Backend REST API Server** | **Render Cloud** | 🔗 [localfix-backend-gfu0.onrender.com/api](https://localfix-backend-gfu0.onrender.com/api) |
| **Source Code Repository** | **GitHub** | 🔗 [github.com/123angmish/LocalFix-Local-Services-Platform](https://github.com/123angmish/LocalFix-Local-Services-Platform) |

---

## 🌟 10 Key Differentiator Modules & Master Features

### 1. 🤖 AI Issue Diagnosis ("What's Broken?")
- **Multimodal AI Engine**: Natural language & symptom-based diagnosis returning detected category, likely issue, possible causes, severity (`LOW`/`MEDIUM`/`HIGH`/`URGENT`), urgency, recommended technician type, duration, and price estimate.
- **Pluggable LLM Fallback**: Dual-integration supporting Google Gemini, OpenAI REST APIs, and an intelligent Regex NLP fallback engine.

### 2. ⚡ 60-Minute Emergency Priority Dispatch
- Instant SOS dispatch modal for urgent jobs (Electrician, Plumber, Locksmith, AC Breakdown) with guaranteed ETA matching under 60 minutes.

### 3. 📊 Transparent Reverse Quote Marketplace
- Customer receives competitive quotes from 2–3 verified local professionals. Compare by price, rating, arrival time, and warranty terms.

### 4. 🚨 AI Fraud & Overcharging Detection
- Real-time pricing intelligence compares submitted quotes against historical local database ranges. Displays **⚠️ Overcharging Warning Alerts** if quotes exceed typical pricing.

### 5. 🛡️ Verified Professionals & Aadhaar/KYC
- Multi-step provider onboarding including Aadhaar identity verification (`kyc_documents`), skill testing, background status checks, and 4.9★ real customer ratings.

### 6. 📑 Digital Repair Passport (Flagship Retention Feature)
- Asset tracking for home appliances (AC, Refrigerator, Plumbing fixtures). Maintains lifetime maintenance logs, replaced parts history, total money spent, and warranty timelines.

### 7. 📸 Compulsory Parts Proof & Security OTP
- **4-Digit Cryptographic OTP**: Generated per booking; provider verifies code upon arrival and completion.
- **Parts Proof Logging**: Compulsory upload of Old Part photo, New Part photo, work summary, and digital invoice.

### 8. 🛡️ 30-Day Fix Guarantee Warranties
- Automatic 7 / 15 / 30-day service warranty protection issued for all completed jobs (`warranties`) with 1-click claim filing.

### 9. 🏢 Apartment & Hostel Mode (Society/PG Dashboard)
- Centralized maintenance hub (`/society-dashboard`) for society committees, co-op housing, and PG hostels to log flat tickets and track dedicated plumbers/electricians.

### 10. 💼 Provider SaaS Mini-CRM
- Dedicated technician operations dashboard (`/vendor/crm`) featuring job dispatch, monthly payout analytics, repeat customer directory, digital invoices, and Online/Offline availability toggle.

---

## 💳 Payment Options & Checkout

- ⚡ **Direct UPI VPA Payment** (GPay, Paytm, PhonePe zero-fee instant transfer)
- 💵 **Cash on Service Delivery (COD)** (Pay technician after inspection and work completion)
- 💳 **Credit / Debit Cards**
- 🎟️ **Instant Coupons** (`FIRSTFIX10`, `SUPERHOME20`, `WELCOME50`)

---

## 🔒 Enterprise Security & Data Protection

1. **Password Encryption**: All credentials salted and double-hashed with **BCrypt (Strength 12)**.
2. **Stateless JWT Security**: HMAC-SHA256 token verification with 24-hour expiration, UUID token IDs, and `JwtAuthenticationFilter`.
3. **Role-Based Authorization**: Fine-grained `@EnableMethodSecurity` restricting endpoints across `ROLE_CUSTOMER`, `ROLE_VENDOR`, and `ROLE_ADMIN`.
4. **Data Isolation & Push Protection**: Secret keys (`AI_API_KEY`) isolated in environment variables. Zero hardcoded API keys in repository.
5. **Database Integrity**: PostgreSQL Flyway V4 schema migrations (`V1__initial_schema.sql` through `V4__startup_mvp_schema.sql`) for zero data loss and persistent history.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2.3, Spring Security, Spring Data JPA, Hibernate, Jackson, RestTemplate, Flyway Migrations |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons, Axios, React Hot Toast, React Router v6 |
| **Database** | PostgreSQL / H2 Database Engine with 15+ Normalized Relational Tables |
| **AI Layer** | Multimodal LLM Abstraction (`AIService`) with Gemini, OpenAI, & Regex NLP Fallback |
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
| **Vendor** | `vendor@localfix.com` | `Vendor@123` | `/vendor/dashboard` & `/vendor/crm` |

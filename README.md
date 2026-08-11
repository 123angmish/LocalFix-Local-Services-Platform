# 🚀 LocalFix — AI-Powered Trusted Local Repair Marketplace (Startup MVP)

**LocalFix** is a production-grade startup MVP built as an **AI-Powered Trusted Local Repair Marketplace** that diagnoses repair problems, estimates fair prices, matches verified professionals, tracks work proof, and maintains permanent digital **Repair Passports** for home assets.

Primary Launch Categories: **AC Repair**, **Electrician**, and **Plumbing** (extensible taxonomy).

> **Tagline**: *Show us what's broken. We'll get it fixed.*

---

## 🌟 Core Product Differentiation & Key Features

### 1. 🤖 AI Problem Diagnosis ("What's Broken?")
- **Multimodal AI Diagnosis Engine**: Describe your issue or upload photos to receive structured diagnosis: detected category, likely issue, possible causes, severity (`LOW`/`MEDIUM`/`HIGH`/`URGENT`), urgency, recommended technician type, and estimated price range.
- **Pluggable AI Abstraction (`AIService`)**: Connects to external multimodal LLMs via `AI_API_KEY`. If unconfigured, explicitly displays **"AI service unavailable"** without returning fake hardcoded scores.

### 2. 📊 Fair Price Checker & Pricing Intelligence
- **Database Baseline Pricing**: Evaluates submitted provider quotes against category baseline ranges (`service_pricings`).
- **Transparent Price Badging**: Categorizes quotes into **Fair Price**, **Slightly Above Typical**, or **Significantly Above Typical** with market explanations.

### 3. 📑 Digital Repair Passport (Flagship Feature)
- **Asset History**: Register appliances (AC, Refrigerator, Plumbing fixtures) and maintain a digital lifetime service history.
- **Parts Log & Expenditure**: Tracks total maintenance spent per appliance, replaced parts, work summaries, before/after photos, and active warranty terms.

### 4. 🛡️ Professional KYC & Verified Provider Matching
- **Document KYC Verification**: Professionals upload identity/address documents (`kyc_documents`). Admin reviews and verifies before providers receive normal customer jobs.
- **Smart Matching Engine**: Ranks providers by category match, skills, KYC status, distance, availability, rating, and response rate.

### 5. 📸 Before / After Work Proof & 4-Digit Security OTP
- **Cryptographic Security OTP**: Customer holds a secret 4-digit code generated per booking. Provider verifies code upon arrival and job completion.
- **Work Proof Logging**: Providers log before/after photos, work performed notes, labour charge, parts charge, and replaced parts breakdown.

### 6. 🛡️ 30-Day Warranties & Dispute Resolution
- **Service Warranties**: Automatic 30-day coverage issued for completed jobs (`warranties`). One-click warranty claims (`warranty_claims`).
- **Marketplace Dispute System**: Customer/Provider dispute resolution flow (`disputes`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2.3, Spring Security, Spring Data JPA, Redis, WebSockets, Flyway V4 Migrations, Apache PDFBox |
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS 3, Recharts, Lucide React, React Hot Toast, Axios |
| **Database** | PostgreSQL (Docker / Production) & Flyway Database Migrations (`V1`..`V4`) |
| **AI Layer** | Pluggable Multimodal LLM Abstraction (`AIService`) via `AI_API_KEY` |
| **Storage** | Pluggable File Storage Abstraction (`LocalStorageService` for dev, S3-ready) |
| **API Specs** | OpenAPI 3.0 / Swagger UI (`http://localhost:8080/swagger-ui.html`) |

---

## 🏗️ Database Architecture & Migrations (Flyway V4)

Key Normalized Tables:
- `users`, `refresh_tokens`, `vendor_profiles`, `kyc_documents`
- `service_categories`, `services`, `service_pricings`
- `bookings`, `payments`, `reviews`, `quotes`, `notifications`
- `appliances`, `repair_passports`, `work_proofs`, `replaced_parts`
- `warranties`, `warranty_claims`, `disputes`, `user_addresses`

---

## ⚙️ Environment Variables (`.env.example`)

Copy `.env.example` to `.env` or set environment variables:
```bash
# AI Key (Gemini / OpenAI)
AI_API_KEY=your_multimodal_api_key_here

# PostgreSQL Connection
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/localfixdb
SPRING_DATASOURCE_USERNAME=localfix_user
SPRING_DATASOURCE_PASSWORD=localfix_secret_password
FLYWAY_ENABLED=true

# Redis & Storage
REDIS_HOST=localhost
REDIS_PORT=6379
UPLOAD_DIR=uploads
```

---

## 🚀 Local Development Setup

### 1. Start Infrastructure (PostgreSQL & Redis):
```bash
docker compose up -d
```

### 2. Run Spring Boot Backend:
```bash
cd backend
mvn spring-boot:run
```
*(Backend API available at `http://localhost:8080/api`)*

### 3. Run React Frontend:
```bash
cd frontend
npm run dev
```
*(Frontend web app available at `http://localhost:5173`)*

---

## 🔑 Default Accounts (Development Profile)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@localfix.com` | `Admin@123` |
| **Customer** | `customer@localfix.com` | `Customer@123` |
| **Provider** | `vendor@localfix.com` | `Vendor@123` |

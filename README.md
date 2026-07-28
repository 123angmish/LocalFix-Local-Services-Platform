# 🚀 LocalFix — AI-Powered Hyperlocal Services Marketplace

**LocalFix** is a production-quality, startup-ready 2026 hyperlocal services platform built with **Java 21**, **Spring Boot 3**, **Spring Security + JWT**, **Spring Data JPA**, **Redis**, **WebSockets**, **Flyway**, **PostgreSQL**, and **React 18 + Vite + Tailwind CSS**.

> **Tagline**: *Trusted help, right around the corner. Describe it. Diagnose it. Fix it.*

---

## 🌟 Key Features & Startup Capabilities

### 🔐 Authentication & Security
- **Role-based authorization**: `CUSTOMER`, `VENDOR`, `ADMIN`.
- **JWT & Refresh Token Rotation**: Access tokens with secure refresh token rotation (`POST /api/v1/auth/refresh`).
- **BCrypt password hashing** & method-level security (`@PreAuthorize`).

### 🤖 AI FixLens & Smart Diagnosis
- **Natural Language & Image Diagnosis Engine**: Enter complex problems (*"Kitchen sink leaking and water flooding tiles"*), get instant severity ratings, duration estimates, cost ranges, safety warnings, and matching professionals.
- **Rule-Based Fallback Engine**: Works out-of-the-box without requiring third-party API keys.

### 🛡️ Live Safety & 4-Digit OTP Verification
- **2-Step Verification Code**: Customer receives a unique 4-digit code on their booking card. Technicians must input the code when starting work (`IN_PROGRESS`) and completing work (`COMPLETED`) to eliminate fraud.

### 💰 Reverse Bidding Marketplace & FixPass Subscriptions
- **Reverse Quotes (`/api/v1/quotes`)**: Non-emergency requirement posting where vendors submit competitive price quotes with warranty terms.
- **FixPass Memberships (`/api/v1/subscriptions`)**: Tiered subscription plans (*Basic*, *Family*, *Rental*) providing free visiting charges, priority support, and discount perks.

### 🏠 Property Maintenance Passport & Emergency SOS
- **Property Passport (`/api/v1/properties`)**: Comprehensive repair history timeline, appliance service records, and upcoming preventive maintenance tasks for saved homes.
- **LocalFix SOS (`/api/v1/sos`)**: Priority emergency dispatch for electrical hazards, pipe bursts, and lockout emergencies.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2.3, Spring Security, Spring Data JPA, Redis, WebSockets, Flyway, Apache PDFBox |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion, Recharts, Lucide React, React Hot Toast, Axios |
| **Database** | PostgreSQL (Docker Production) / H2 (In-Memory Out-of-the-Box) |
| **API Docs** | Swagger UI / OpenAPI 3.0 (`http://localhost:8080/swagger-ui.html`) |

---

## 🔑 Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@localfix.com` | `Admin@123` |
| **Customer** | `customer@localfix.com` | `Customer@123` |
| **Vendor / Pro** | `vendor@localfix.com` | `Vendor@123` |
| **Apex Plumbing** | `apex.plumbing@localfix.com` | `Vendor@123` |

---

## 🚀 How to Run Locally

### Option A: Local Development Server

#### 1. Start Backend Server:
```powershell
cd backend
.\mvn_bin\bin\mvn.cmd spring-boot:run
```
*(Backend runs on `http://localhost:8080`)*

#### 2. Start Frontend App:
In a new terminal window:
```powershell
cd frontend
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

### Option B: Docker Compose Full Stack
```powershell
docker compose up --build
```

---

## 📖 How to Explain This Project in an Interview (10+ LPA Guide)

Check out the full interview preparation guide here:
👉 **[PORTFOLIO_GUIDE.md](file:///c:/Users/angel%20mishra/Downloads/Telegram%20Desktop/LocalFix-Local-Services-Platform/PORTFOLIO_GUIDE.md)**

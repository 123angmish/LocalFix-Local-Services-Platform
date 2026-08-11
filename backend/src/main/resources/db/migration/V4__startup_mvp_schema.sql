-- LocalFix PostgreSQL Flyway Migration Schema (V4 - Startup MVP Core Extensions)

-- 1. KYC Documents Table for Professional Provider Verification
CREATE TABLE IF NOT EXISTS kyc_documents (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- AADHAAR, PAN, DRIVING_LICENSE, BUSINESS_LICENSE
    document_number VARCHAR(100),
    document_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Service Pricing Baseline Table for Fair Price Intelligence Module
CREATE TABLE IF NOT EXISTS service_pricings (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    job_type VARCHAR(255) NOT NULL,
    min_typical_price DECIMAL(10,2) NOT NULL,
    max_typical_price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'JOB',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Appliance / Asset Management for Repair Passport
CREATE TABLE IF NOT EXISTS appliances (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. Master Bedroom AC
    brand VARCHAR(100),         -- e.g. LG, Samsung, Daikin
    model VARCHAR(100),
    category_id BIGINT REFERENCES service_categories(id) ON DELETE SET NULL,
    purchase_year INT,
    serial_number VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Repair Passport Entry (Linked to Assets and Bookings)
CREATE TABLE IF NOT EXISTS repair_passports (
    id BIGSERIAL PRIMARY KEY,
    appliance_id BIGINT NOT NULL REFERENCES appliances(id) ON DELETE CASCADE,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    diagnosis_summary TEXT,
    work_summary TEXT NOT NULL,
    total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    parts_replaced_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Work Proof Table for Before / After Photos & Labor Charges
CREATE TABLE IF NOT EXISTS work_proofs (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    before_image_url TEXT,
    after_image_url TEXT,
    work_performed_notes TEXT NOT NULL,
    labour_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    parts_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Replaced Parts Log Breakdown
CREATE TABLE IF NOT EXISTS replaced_parts (
    id BIGSERIAL PRIMARY KEY,
    work_proof_id BIGINT NOT NULL REFERENCES work_proofs(id) ON DELETE CASCADE,
    part_name VARCHAR(255) NOT NULL,
    part_price DECIMAL(10,2) NOT NULL,
    old_part_image_url TEXT,
    new_part_image_url TEXT,
    warranty_months INT DEFAULT 0
);

-- 7. Warranty System Management
CREATE TABLE IF NOT EXISTS warranties (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id BIGINT NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRING_SOON, EXPIRED, CLAIMED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Warranty Claims
CREATE TABLE IF NOT EXISTS warranty_claims (
    id BIGSERIAL PRIMARY KEY,
    warranty_id BIGINT NOT NULL REFERENCES warranties(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_REVIEW, RESOLVED, REJECTED
    admin_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Marketplace Dispute System
CREATE TABLE IF NOT EXISTS disputes (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    raised_by_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, RESOLVED, REJECTED
    admin_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Saved User Addresses
CREATE TABLE IF NOT EXISTS user_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL DEFAULT 'Home',
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Baseline Pricing Intelligence Data for Core Categories
INSERT INTO service_pricings (category_id, job_type, min_typical_price, max_typical_price, unit)
SELECT id, 'AC Water Leakage & Cleaning', 399.00, 799.00, 'JOB' FROM service_categories WHERE name = 'AC Repair'
ON CONFLICT DO NOTHING;

INSERT INTO service_pricings (category_id, job_type, min_typical_price, max_typical_price, unit)
SELECT id, 'AC Capacitor Replacement', 599.00, 1299.00, 'JOB' FROM service_categories WHERE name = 'AC Repair'
ON CONFLICT DO NOTHING;

INSERT INTO service_pricings (category_id, job_type, min_typical_price, max_typical_price, unit)
SELECT id, 'Electrician Switch & Wiring Repair', 199.00, 499.00, 'JOB' FROM service_categories WHERE name = 'Electrician'
ON CONFLICT DO NOTHING;

INSERT INTO service_pricings (category_id, job_type, min_typical_price, max_typical_price, unit)
SELECT id, 'Plumbing Tap & Pipe Fix', 249.00, 599.00, 'JOB' FROM service_categories WHERE name = 'Plumber'
ON CONFLICT DO NOTHING;

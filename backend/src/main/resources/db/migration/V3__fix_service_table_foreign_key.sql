-- Create services table if not exists matching Hibernate @Table(name = "services")
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Copy any existing service_items into services if service_items exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'service_items') THEN
        INSERT INTO services (id, vendor_id, category_id, title, description, price, duration_minutes, active, city, created_at)
        SELECT id, vendor_id, category_id, title, description, price, duration_minutes, active, city, created_at
        FROM service_items
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Drop foreign key constraint on bookings referencing service_items and re-point to services(id)
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS fk_service_id;
ALTER TABLE bookings ADD CONSTRAINT bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;

-- ====================================================================
-- TRIVE LOGISTICS ENGINE — COMPLETE POSTGRESQL PRODUCTION SCHEMA
-- Generated: 2026-10-24
-- Target: Supabase PostgreSQL
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Existing Partial Tables (Ensures Fresh Schema)
DROP TABLE IF EXISTS public.route_computations CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.parcels CASCADE;
DROP TABLE IF EXISTS public.hubs CASCADE;
DROP TABLE IF EXISTS public.couriers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- --------------------------------------------------------------------
-- 3. Table: users
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'courier', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 4. Table: couriers
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.couriers (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL DEFAULT 'motorcycle' CHECK (vehicle_type IN ('motorcycle', 'bicycle', 'van')),
    vehicle_plate TEXT,
    is_online BOOLEAN NOT NULL DEFAULT false,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.0 AND rating <= 5.0),
    total_deliveries INTEGER NOT NULL DEFAULT 0,
    last_ping TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 5. Table: hubs (Sorting Facilities for Kruskal's MST)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 5000
);

-- --------------------------------------------------------------------
-- 6. Table: parcels (Core Shipments)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parcels (
    id TEXT PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL,
    origin_hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    dest_hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL,
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'looking_for_courier' CHECK (status IN ('looking_for_courier', 'in_delivery', 'in_transit', 'received', 'pending', 'cancelled')),
    package_type TEXT NOT NULL DEFAULT 'Express Parcel',
    weight_kg NUMERIC(5,2) NOT NULL DEFAULT 1.50,
    is_fragile BOOLEAN NOT NULL DEFAULT true,
    handling_notes TEXT,
    card_color TEXT NOT NULL DEFAULT 'green' CHECK (card_color IN ('green', 'coral', 'peach', 'lavender')),
    arrival_time TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 7. Table: invoices (Digital Receipts & Itemized Surcharges)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    parcel_id TEXT UNIQUE NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
    base_fare NUMERIC(10,2) NOT NULL DEFAULT 80.00,
    distance_fee NUMERIC(10,2) NOT NULL DEFAULT 45.00,
    fragile_fee NUMERIC(10,2) NOT NULL DEFAULT 20.00,
    vat_tax NUMERIC(10,2) NOT NULL DEFAULT 7.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
    payment_status TEXT NOT NULL DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Pending', 'Refunded')),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 8. Table: route_computations (C++ Dijkstra & BFS Algorithm Telemetry)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.route_computations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id TEXT REFERENCES public.parcels(id) ON DELETE CASCADE,
    algorithm_used TEXT NOT NULL,
    distance_miles NUMERIC(6,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    formatted_eta TEXT NOT NULL,
    nodes_explored INTEGER NOT NULL,
    latency_ms NUMERIC(8,4) NOT NULL,
    polyline_geojson JSONB NOT NULL,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 9. PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_parcels_status ON public.parcels(status);
CREATE INDEX IF NOT EXISTS idx_parcels_created_at ON public.parcels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parcels_courier_id ON public.parcels(courier_id);
CREATE INDEX IF NOT EXISTS idx_invoices_parcel_id ON public.invoices(parcel_id);
CREATE INDEX IF NOT EXISTS idx_couriers_online ON public.couriers(is_online);
CREATE INDEX IF NOT EXISTS idx_route_computations_parcel_id ON public.route_computations(parcel_id);

-- ====================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_computations ENABLE ROW LEVEL SECURITY;

-- Allow Mobile Client Open RLS (Public Anon Key)
CREATE POLICY "Public Users Access" ON public.users FOR ALL USING (true);
CREATE POLICY "Public Couriers Access" ON public.couriers FOR ALL USING (true);
CREATE POLICY "Public Hubs Access" ON public.hubs FOR ALL USING (true);
CREATE POLICY "Public Parcels Access" ON public.parcels FOR ALL USING (true);
CREATE POLICY "Public Invoices Access" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Public Route Computations Access" ON public.route_computations FOR ALL USING (true);

-- ====================================================================
-- 11. INITIAL SEED DATA (DHAKA LOGISTICS CORRIDOR)
-- ====================================================================

-- Seed Hubs
INSERT INTO public.hubs (id, name, address, latitude, longitude, capacity)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Dhanmondi Hub', 'Road 27, Dhanmondi, Dhaka', 23.7509, 90.3754, 8000),
    ('22222222-2222-2222-2222-222222222222', 'Gulshan Hub', 'Road 103, Gulshan 2, Dhaka', 23.7925, 90.4078, 12000),
    ('33333333-3333-3333-3333-333333333333', 'Tejgaon Industrial Hub', 'Tejgaon I/A, Dhaka', 23.7640, 90.3950, 15000),
    ('44444444-4444-4444-4444-444444444444', 'Uttara Terminal Depot', 'Sector 7, Uttara, Dhaka', 23.8680, 90.3980, 10000),
    ('55555555-5555-5555-5555-555555555555', 'Mirpur Station', 'Mirpur 10 Circle, Dhaka', 23.8070, 90.3685, 9000)
ON CONFLICT (name) DO NOTHING;

-- Seed Users
INSERT INTO public.users (id, full_name, phone, email, role)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Emily Carter', '+880 1700-000000', 'emily.carter@gmail.com', 'customer'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Carlos Ramirez (Rider)', '+880 1711-111111', 'carlos.rider@trive.com', 'courier'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Tanvir Ahmed (Rider)', '+880 1722-222222', 'tanvir.rider@trive.com', 'courier'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rashed Molla', '+880 1733-333333', 'rashedmolla541@gmail.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Seed Couriers
INSERT INTO public.couriers (id, vehicle_type, vehicle_plate, is_online, current_lat, current_lng, rating, total_deliveries)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'motorcycle', 'DHAKA METRO HA-5821', true, 23.7750, 90.3950, 4.95, 342),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bicycle', 'DHAKA METRO KHA-1102', true, 23.7620, 90.3880, 4.88, 198)
ON CONFLICT (id) DO NOTHING;

-- Seed Parcels
INSERT INTO public.parcels (
    id, sender_id, courier_id, origin_hub_id, dest_hub_id,
    receiver_name, receiver_phone, pickup_address, delivery_address,
    status, package_type, weight_kg, is_fragile, handling_notes,
    card_color, arrival_time
)
VALUES
    (
        '#F165G258',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        'Emily Carter',
        '+880 1700-000000',
        'Road 27, Dhanmondi, Dhaka',
        '2210 Coral Way, Apt 3C (Dhaka Hub)',
        'looking_for_courier',
        'Express Parcel',
        1.80,
        true,
        'Please ensure the package is handled with care - fragile items inside.',
        'green',
        '1:30 PM'
    ),
    (
        '#CB1AD25',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '33333333-3333-3333-3333-333333333333',
        '22222222-2222-2222-2222-222222222222',
        'Mark Wood',
        '+880 1711-111111',
        'Tejgaon Industrial Hub',
        '1024 Ocean Dr, Suite 500',
        'in_delivery',
        'Retail Merchandise',
        1.20,
        false,
        'Standard retail package delivery.',
        'coral',
        '12:05 PM'
    ),
    (
        '#CA19WS8',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        NULL,
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        'Sarah Khan',
        '+880 1722-222222',
        'North Terminal Depot',
        '742 Evergreen Terrace',
        'in_transit',
        'Standard Freight',
        4.80,
        false,
        'Leave at building security desk.',
        'lavender',
        '3:15 PM'
    ),
    (
        '#A856K005',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        'Karim Ullah',
        '+880 1733-333333',
        'Biscayne Distribution Ctr',
        '2210 Coral Way, Apt 3C',
        'received',
        'Same-Day Delivery',
        0.80,
        false,
        'Customer signed and received.',
        'peach',
        '08:22 AM'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Invoices
INSERT INTO public.invoices (
    id, parcel_id, base_fare, distance_fee, fragile_fee, vat_tax, total_amount, payment_method, payment_status
)
VALUES
    ('TRV-INV-9821', '#F165G258', 80.00, 45.00, 20.00, 7.00, 152.00, 'Cash on Delivery', 'Paid'),
    ('TRV-INV-8419', '#CB1AD25', 70.00, 35.00, 0.00, 5.00, 110.00, 'bKash Online', 'Paid'),
    ('TRV-INV-7104', '#A856K005', 90.00, 60.00, 25.00, 9.00, 184.00, 'Credit Card', 'Paid')
ON CONFLICT (id) DO NOTHING;

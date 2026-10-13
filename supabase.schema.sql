-- Webshop Database Schema
-- Run this in Supabase SQL Editor to set up webshop authentication and cart management

-- ═══════════════════════════════════════════════════════════════════════════
-- Webshop User Profiles (links to auth.users)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webshop_user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'Belgium',
  contact_person_id uuid, -- Links to ATLAS contact person (sync)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webshop_user_profiles_user ON webshop_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_webshop_user_profiles_contact ON webshop_user_profiles(contact_person_id);

ALTER TABLE webshop_user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON webshop_user_profiles;
CREATE POLICY "Users can view own profile"
  ON webshop_user_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON webshop_user_profiles;
CREATE POLICY "Users can update own profile"
  ON webshop_user_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Cart Holds (items reserved by logged-in users for 15 minutes)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS cart_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL, -- Inventory item ID from ATLAS
  product_name text NOT NULL, -- Cached for display
  product_price numeric(10,2) NOT NULL, -- Cached for display
  held_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL, -- held_at + 15 minutes
  released_at timestamptz, -- When hold was released/order created
  status text DEFAULT 'ACTIVE', -- 'ACTIVE', 'RELEASED', 'EXPIRED', 'PURCHASED'
  release_reason text, -- Why it was released ('manual_release', 'expired', 'order_created', etc)
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_holds_user ON cart_holds(user_id, status);
CREATE INDEX IF NOT EXISTS idx_cart_holds_product ON cart_holds(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_holds_expires ON cart_holds(expires_at) WHERE status = 'ACTIVE';

ALTER TABLE cart_holds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own holds" ON cart_holds;
CREATE POLICY "Users can view own holds"
  ON cart_holds FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own holds" ON cart_holds;
CREATE POLICY "Users can insert own holds"
  ON cart_holds FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Webshop Orders (created after successful checkout)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webshop_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text NOT NULL UNIQUE, -- e.g., WS-2026-0001
  status text DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  
  -- Items in order
  items jsonb NOT NULL, -- [{id, name, price, grade, condition}, ...]
  
  -- Pricing
  subtotal numeric(10,2) NOT NULL,
  tax numeric(10,2) DEFAULT 0,
  shipping_cost numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  
  -- Shipping address (can be different from contact)
  shipping_first_name text NOT NULL,
  shipping_last_name text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_postal_code text NOT NULL,
  shipping_country text NOT NULL DEFAULT 'Belgium',
  shipping_phone text,
  
  -- Payment & fulfillment
  payment_method text, -- 'credit_card', 'paypal', etc (future Shopify integration)
  payment_status text DEFAULT 'UNPAID', -- 'UNPAID', 'PAID', 'FAILED'
  tracking_number text,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webshop_orders_user ON webshop_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_status ON webshop_orders(status);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_number ON webshop_orders(order_number);

ALTER TABLE webshop_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON webshop_orders;
CREATE POLICY "Users can view own orders"
  ON webshop_orders FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Function: Generate order numbers (e.g., WS-2026-0001)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_webshop_order_number()
RETURNS text AS $$
DECLARE
  v_year text;
  v_prefix text;
  v_next integer;
BEGIN
  v_year := TO_CHAR(now(), 'YYYY');
  v_prefix := 'WS-' || v_year;
  
  SELECT COALESCE(MAX((regexp_match(order_number, '-([0-9]+)$'))[1]::integer), 0) + 1
    INTO v_next
    FROM webshop_orders
   WHERE order_number LIKE v_prefix || '-%';
  
  RETURN v_prefix || '-' || lpad(v_next::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- Function: Auto-release expired cart holds (run periodically via cron)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION release_expired_cart_holds()
RETURNS void AS $$
BEGIN
  UPDATE cart_holds
  SET status = 'EXPIRED',
      released_at = now(),
      release_reason = 'auto_expired_15min'
  WHERE status = 'ACTIVE'
    AND expires_at <= now();
END;
$$ LANGUAGE plpgsql;

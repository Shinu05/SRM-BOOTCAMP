-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INT DEFAULT 10,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount NUMERIC NOT NULL,
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_phone TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price NUMERIC NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Products: Publicly Readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" 
  ON products FOR SELECT 
  USING (true);

-- Cart Items: Restricted to matching user_id
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their matching cart items" 
  ON cart_items FOR ALL 
  USING (user_id = auth.uid()::text OR user_id = (SELECT auth.jwt() ->> 'sub'))
  WITH CHECK (user_id = auth.uid()::text OR user_id = (SELECT auth.jwt() ->> 'sub'));

-- Orders: Restricted to matching user_id
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view matching orders" 
  ON orders FOR SELECT 
  USING (user_id = auth.uid()::text OR user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can create orders" 
  ON orders FOR INSERT 
  WITH CHECK (user_id = auth.uid()::text OR user_id = (SELECT auth.jwt() ->> 'sub'));

-- Order Items: Restricted to order owner
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view items of matching orders" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid()::text OR orders.user_id = (SELECT auth.jwt() ->> 'sub'))
    )
  );

CREATE POLICY "Users can insert order items" 
  ON order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid()::text OR orders.user_id = (SELECT auth.jwt() ->> 'sub'))
    )
  );

-- SAMPLE SEED DATA FOR PRODUCTS
INSERT INTO products (name, description, price, image_url, category, stock, slug)
VALUES
  (
    'Wireless Noise-Canceling Headphones',
    'Immerse yourself in crystal-clear audio with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
    299.99,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'Audio',
    25,
    'wireless-noise-canceling-headphones'
  ),
  (
    'Minimalist Leather Watch',
    'Crafted with a genuine leather strap and sapphire glass crystal, this minimalist timepiece blends timeless elegance with everyday versatility.',
    149.50,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'Accessories',
    15,
    'minimalist-leather-watch'
  ),
  (
    'Ergonomic Mechanical Keyboard',
    'Tactile mechanical switches, customizable RGB backlighting, and an ergonomic split layout for effortless all-day typing comfort.',
    189.00,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    'Electronics',
    30,
    'ergonomic-mechanical-keyboard'
  ),
  (
    'Smart Fitness Tracker Watch',
    'Track continuous heart rate, sleep metrics, workout routines, and notifications with a crisp AMOLED display and 7-day battery life.',
    129.99,
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    'Wearables',
    20,
    'smart-fitness-tracker'
  ),
  (
    'Premium Canvas Everyday Backpack',
    'Water-resistant heavy-duty canvas, padded 15-inch laptop compartment, and organized internal pockets designed for travel and commute.',
    89.95,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'Bags',
    40,
    'premium-canvas-backpack'
  ),
  (
    'Studio Pro Wireless Earbuds',
    'True wireless audio with custom dynamic drivers, IPX5 water resistance, and a compact wireless charging case.',
    159.00,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    'Audio',
    35,
    'studio-wireless-earbuds'
  ),
  (
    'Sleek Minimalist LED Desk Lamp',
    'Adjustable color temperature, touch-sensitive dimming control, and integrated wireless smartphone charging pad built into the base.',
    79.99,
    'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80',
    'Home',
    18,
    'sleek-desk-lamp'
  ),
  (
    'Waterproof Portable Bluetooth Speaker',
    '360-degree punchy bass, IP67 dust and waterproof rating, and 24 hours of continuous playback for indoor and outdoor adventures.',
    119.00,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    'Audio',
    50,
    'portable-bluetooth-speaker'
  )
ON CONFLICT (slug) DO NOTHING;

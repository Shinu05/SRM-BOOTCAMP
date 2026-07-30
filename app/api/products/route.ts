import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fallback products dataset in case Supabase is not configured yet
const FALLBACK_PRODUCTS = [
  {
    id: '1',
    slug: 'wireless-noise-canceling-headphones',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immerse yourself in crystal-clear audio with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
    category: 'Audio',
    stock: 25,
  },
  {
    id: '2',
    slug: 'minimalist-leather-watch',
    name: 'Minimalist Leather Watch',
    price: 149.50,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Crafted with a genuine leather strap and sapphire glass crystal, this minimalist timepiece blends timeless elegance with everyday versatility.',
    category: 'Accessories',
    stock: 15,
  },
  {
    id: '3',
    slug: 'ergonomic-mechanical-keyboard',
    name: 'Ergonomic Mechanical Keyboard',
    price: 189.00,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Tactile mechanical switches, customizable RGB backlighting, and an ergonomic split layout for effortless all-day typing comfort.',
    category: 'Electronics',
    stock: 30,
  },
  {
    id: '4',
    slug: 'smart-fitness-tracker',
    name: 'Smart Fitness Tracker Watch',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    description: 'Track continuous heart rate, sleep metrics, workout routines, and notifications with a crisp AMOLED display and 7-day battery life.',
    category: 'Wearables',
    stock: 20,
  },
  {
    id: '5',
    slug: 'premium-canvas-backpack',
    name: 'Premium Canvas Everyday Backpack',
    price: 89.95,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Water-resistant heavy-duty canvas, padded 15-inch laptop compartment, and organized internal pockets designed for travel and commute.',
    category: 'Bags',
    stock: 40,
  },
  {
    id: '6',
    slug: 'studio-wireless-earbuds',
    name: 'Studio Pro Wireless Earbuds',
    price: 159.00,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'True wireless audio with custom dynamic drivers, IPX5 water resistance, and a compact wireless charging case.',
    category: 'Audio',
    stock: 35,
  },
  {
    id: '7',
    slug: 'sleek-desk-lamp',
    name: 'Sleek Minimalist LED Desk Lamp',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80',
    description: 'Adjustable color temperature, touch-sensitive dimming control, and integrated wireless smartphone charging pad built into the base.',
    category: 'Home',
    stock: 18,
  },
  {
    id: '8',
    slug: 'portable-bluetooth-speaker',
    name: 'Waterproof Portable Bluetooth Speaker',
    price: 119.00,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    description: '360-degree punchy bass, IP67 dust and waterproof rating, and 24 hours of continuous playback for indoor and outdoor adventures.',
    category: 'Audio',
    stock: 50,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const category = searchParams.get('category')?.trim();

  try {
    let query = supabase.from('products').select('*');

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category && category.toLowerCase() !== 'all') {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let filtered = [...FALLBACK_PRODUCTS];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
        );
      }
      if (category && category.toLowerCase() !== 'all') {
        const c = category.toLowerCase();
        filtered = filtered.filter((p) => p.category.toLowerCase() === c);
      }
      return NextResponse.json(filtered);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error querying Supabase products:', err);
    return NextResponse.json(FALLBACK_PRODUCTS);
  }
}

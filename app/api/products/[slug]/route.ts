import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  description: string;
  category: string;
  stock?: number;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'wireless-noise-canceling-headphones',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immerse yourself in crystal-clear audio with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
    category: 'Audio',
  },
  {
    id: '2',
    slug: 'minimalist-leather-watch',
    name: 'Minimalist Leather Watch',
    price: 149.50,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Crafted with a genuine leather strap and sapphire glass crystal, this minimalist timepiece blends timeless elegance with everyday versatility.',
    category: 'Accessories',
  },
  {
    id: '3',
    slug: 'ergonomic-mechanical-keyboard',
    name: 'Ergonomic Mechanical Keyboard',
    price: 189.00,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Tactile mechanical switches, customizable RGB backlighting, and an ergonomic split layout for effortless all-day typing comfort.',
    category: 'Electronics',
  },
  {
    id: '4',
    slug: 'smart-fitness-tracker',
    name: 'Smart Fitness Tracker Watch',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    description: 'Track continuous heart rate, sleep metrics, workout routines, and notifications with a crisp AMOLED display and 7-day battery life.',
    category: 'Wearables',
  },
  {
    id: '5',
    slug: 'premium-canvas-backpack',
    name: 'Premium Canvas Everyday Backpack',
    price: 89.95,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Water-resistant heavy-duty canvas, padded 15-inch laptop compartment, and organized internal pockets designed for travel and commute.',
    category: 'Bags',
  },
  {
    id: '6',
    slug: 'studio-wireless-earbuds',
    name: 'Studio Pro Wireless Earbuds',
    price: 159.00,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'True wireless audio with custom dynamic drivers, IPX5 water resistance, and a compact wireless charging case.',
    category: 'Audio',
  },
  {
    id: '7',
    slug: 'sleek-desk-lamp',
    name: 'Sleek Minimalist LED Desk Lamp',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80',
    description: 'Adjustable color temperature, touch-sensitive dimming control, and integrated wireless smartphone charging pad built into the base.',
    category: 'Home',
  },
  {
    id: '8',
    slug: 'portable-bluetooth-speaker',
    name: 'Waterproof Portable Bluetooth Speaker',
    price: 119.00,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    description: '360-degree punchy bass, IP67 dust and waterproof rating, and 24 hours of continuous playback for indoor and outdoor adventures.',
    category: 'Audio',
  },
];

/**
 * Data fetching abstraction helper.
 * Queries Supabase products table by matching slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return {
        ...data,
        image: data.image_url || data.image || '',
      };
    }
  } catch (err) {
    console.error('Error fetching product from Supabase:', err);
  }

  // Fallback lookup if Supabase query returned error or null
  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  return fallback || null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

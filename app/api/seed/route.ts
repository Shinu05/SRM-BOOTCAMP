import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const placeholderProducts = [
  {
    slug: "wireless-noise-canceling-headphones",
    name: "Wireless Noise-Canceling Headphones",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    category: "Audio",
    description: "Immerse yourself in crystal-clear audio with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.",
    stock: 25
  },
  {
    slug: "minimalist-leather-watch",
    name: "Minimalist Leather Watch",
    price: 149.50,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    category: "Accessories",
    description: "A timeless timepiece featuring a genuine leather strap, scratch-resistant sapphire crystal, and precise quartz movement.",
    stock: 12
  },
  {
    slug: "ergonomic-mechanical-keyboard",
    name: "Ergonomic Mechanical Keyboard",
    price: 189.00,
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    category: "Electronics",
    description: "Enhance your typing experience with tactile mechanical switches, customizable RGB backlighting, and a wrist-friendly split design.",
    stock: 8
  },
  {
    slug: "smart-fitness-tracker",
    name: "Smart Fitness Tracker Watch",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
    category: "Wearables",
    description: "Monitor your health 24/7 with heart rate tracking, sleep analysis, built-in GPS, and 50m water resistance.",
    stock: 45
  },
  {
    slug: "premium-canvas-backpack",
    name: "Premium Canvas Everyday Backpack",
    price: 89.95,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    category: "Bags",
    description: "Built for the daily commute or weekend adventures with water-resistant waxed canvas, padded laptop sleeve, and quick-access pockets.",
    stock: 30
  },
  {
    slug: "studio-wireless-earbuds",
    name: "Studio Pro Wireless Earbuds",
    price: 159.00,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    category: "Audio",
    description: "True wireless freedom offering studio-quality sound, sweat resistance, and a compact wireless charging case.",
    stock: 18
  },
  {
    slug: "sleek-desk-lamp",
    name: "Sleek Minimalist LED Desk Lamp",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80",
    category: "Home",
    description: "Brighten your workspace with adjustable color temperatures, touch controls, and an integrated USB charging port.",
    stock: 22
  },
  {
    slug: "portable-bluetooth-speaker",
    name: "Waterproof Portable Bluetooth Speaker",
    price: 119.00,
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    category: "Audio",
    description: "Bring the party anywhere with 360-degree sound, IPX7 waterproof rating, and up to 20 hours of playtime.",
    stock: 50
  }
];

export async function GET() {
  const results = [];
  
  for (const product of placeholderProducts) {
    // Check if exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', product.slug)
      .single();
      
    if (existing) {
      results.push({ slug: product.slug, id: existing.id, status: 'already_exists' });
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select('id')
        .single();
        
      if (error) {
        results.push({ slug: product.slug, error: error.message });
      } else {
        results.push({ slug: product.slug, id: data.id, status: 'inserted' });
      }
    }
  }
  
  return NextResponse.json({ results });
}

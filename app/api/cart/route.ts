import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface CartItemFallback {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    image?: string;
    slug: string;
  };
}

const SAMPLE_PRODUCTS: Record<string, any> = {
  'wireless-noise-canceling-headphones': {
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    category: 'Audio',
    slug: 'wireless-noise-canceling-headphones',
  },
  'minimalist-leather-watch': {
    name: 'Minimalist Leather Watch',
    price: 149.50,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    category: 'Accessories',
    slug: 'minimalist-leather-watch',
  },
  'ergonomic-mechanical-keyboard': {
    name: 'Ergonomic Mechanical Keyboard',
    price: 189.00,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    category: 'Electronics',
    slug: 'ergonomic-mechanical-keyboard',
  },
  'smart-fitness-tracker': {
    name: 'Smart Fitness Tracker Watch',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
    category: 'Wearables',
    slug: 'smart-fitness-tracker',
  },
  'premium-canvas-backpack': {
    name: 'Premium Canvas Everyday Backpack',
    price: 89.95,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    category: 'Bags',
    slug: 'premium-canvas-backpack',
  },
  'studio-wireless-earbuds': {
    name: 'Studio Pro Wireless Earbuds',
    price: 159.00,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    category: 'Audio',
    slug: 'studio-wireless-earbuds',
  },
  'sleek-desk-lamp': {
    name: 'Sleek Minimalist LED Desk Lamp',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80',
    category: 'Home',
    slug: 'sleek-desk-lamp',
  },
  'portable-bluetooth-speaker': {
    name: 'Waterproof Portable Bluetooth Speaker',
    price: 119.00,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    category: 'Audio',
    slug: 'portable-bluetooth-speaker',
  },
};

let fallbackCartStore: CartItemFallback[] = [];

// Helper to attach product info to items if missing
function enrichCartItems(items: any[]) {
  return items.map((item) => {
    if (!item.products) {
      const match =
        SAMPLE_PRODUCTS[item.product_id] ||
        Object.values(SAMPLE_PRODUCTS).find((p) => p.slug === item.product_id);
      if (match) {
        return { ...item, products: { ...match, id: item.product_id } };
      }
    }
    return item;
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json(
      { error: 'user_id query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const enriched = enrichCartItems(data);
      return NextResponse.json({ cart_items: enriched });
    }
  } catch (err) {
    console.error('Error fetching cart items from Supabase:', err);
  }

  const userItems = fallbackCartStore.filter((item) => item.user_id === userId);
  return NextResponse.json({ cart_items: enrichCartItems(userItems) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id, quantity = 1 } = body;

    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: 'user_id and product_id are required' },
        { status: 400 }
      );
    }

    let actualProductId = product_id;
    let targetProductDetails: any = null;

    // Check if product_id is UUID or slug in Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product_id);
      let query = supabase.from('products').select('*');
      if (isUuid) {
        query = query.eq('id', product_id);
      } else {
        query = query.eq('slug', product_id);
      }

      const { data: prodData } = await query.single();
      if (prodData) {
        actualProductId = prodData.id;
        targetProductDetails = prodData;
      }
    } catch (e) {}

    if (!targetProductDetails) {
      targetProductDetails =
        SAMPLE_PRODUCTS[product_id] ||
        Object.values(SAMPLE_PRODUCTS).find((p) => p.slug === product_id);
    }

    // Try Supabase insert/update
    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', actualProductId)
        .single();

      if (existing) {
        const newQty = existing.quantity + quantity;
        const { data: updated, error: updateErr } = await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('id', existing.id)
          .select('*, products(*)')
          .single();

        if (!updateErr && updated) {
          const enriched = enrichCartItems([updated])[0];
          return NextResponse.json({ success: true, item: enriched });
        }
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('cart_items')
          .insert([{ user_id, product_id: actualProductId, quantity }])
          .select('*, products(*)')
          .single();

        if (!insertErr && inserted) {
          const enriched = enrichCartItems([inserted])[0];
          return NextResponse.json({ success: true, item: enriched });
        }
      }
    } catch (dbErr) {
      console.error('Supabase cart insert error:', dbErr);
    }

    // Fallback store insert/update
    const existingIndex = fallbackCartStore.findIndex(
      (item) => item.user_id === user_id && (item.product_id === actualProductId || item.product_id === product_id)
    );

    if (existingIndex > -1) {
      fallbackCartStore[existingIndex].quantity += quantity;
      if (!fallbackCartStore[existingIndex].products && targetProductDetails) {
        fallbackCartStore[existingIndex].products = { ...targetProductDetails, id: actualProductId };
      }
      return NextResponse.json({ success: true, item: fallbackCartStore[existingIndex] });
    } else {
      const newItem: CartItemFallback = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        user_id,
        product_id: actualProductId,
        quantity,
        created_at: new Date().toISOString(),
        products: targetProductDetails ? { ...targetProductDetails, id: actualProductId } : undefined,
      };
      fallbackCartStore.push(newItem);
      return NextResponse.json({ success: true, item: newItem });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: 'id and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      try {
        await supabase.from('cart_items').delete().eq('id', id);
      } catch (e) {}
      fallbackCartStore = fallbackCartStore.filter((item) => item.id !== id);
      return NextResponse.json({ success: true, message: 'Item removed' });
    }

    try {
      const { data: updated, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select('*, products(*)')
        .single();

      if (!error && updated) {
        const enriched = enrichCartItems([updated])[0];
        return NextResponse.json({ success: true, item: enriched });
      }
    } catch (dbErr) {}

    const index = fallbackCartStore.findIndex((item) => item.id === id);
    if (index > -1) {
      fallbackCartStore[index].quantity = quantity;
      return NextResponse.json({ success: true, item: fallbackCartStore[index] });
    }

    return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    try {
      await supabase.from('cart_items').delete().eq('id', id);
    } catch (dbErr) {}

    fallbackCartStore = fallbackCartStore.filter((item) => item.id !== id);

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

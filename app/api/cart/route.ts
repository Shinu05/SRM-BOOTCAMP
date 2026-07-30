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

let fallbackCartStore: CartItemFallback[] = [];

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
      return NextResponse.json({ cart_items: data });
    }
  } catch (err) {
    console.error('Error fetching cart items from Supabase:', err);
  }

  const userItems = fallbackCartStore.filter((item) => item.user_id === userId);
  return NextResponse.json({ cart_items: userItems });
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

    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', product_id)
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
          return NextResponse.json({ success: true, item: updated });
        }
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('cart_items')
          .insert([{ user_id, product_id, quantity }])
          .select('*, products(*)')
          .single();

        if (!insertErr && inserted) {
          return NextResponse.json({ success: true, item: inserted });
        }
      }
    } catch (dbErr) {
      console.error('Supabase cart insert error:', dbErr);
    }

    const existingIndex = fallbackCartStore.findIndex(
      (item) => item.user_id === user_id && item.product_id === product_id
    );

    if (existingIndex > -1) {
      fallbackCartStore[existingIndex].quantity += quantity;
      return NextResponse.json({ success: true, item: fallbackCartStore[existingIndex] });
    } else {
      const newItem: CartItemFallback = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        user_id,
        product_id,
        quantity,
        created_at: new Date().toISOString(),
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
        return NextResponse.json({ success: true, item: updated });
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

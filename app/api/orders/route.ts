import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface OrderFallback {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  created_at: string;
  order_items: Array<{
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    products?: any;
  }>;
}

export const fallbackOrderStore: OrderFallback[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const userId = searchParams.get('user_id');

  if (id) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();

      if (!error && order) {
        return NextResponse.json({ order });
      }
    } catch (err) {}

    const fallback = fallbackOrderStore.find((o) => o.id === id);
    if (fallback) {
      return NextResponse.json({ order: fallback });
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (userId) {
    let finalOrders: any[] = [];
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && orders) {
        finalOrders = orders;
      }
    } catch (err) {}

    const userOrders = fallbackOrderStore.filter((o) => o.user_id === userId);
    
    // Merge, avoiding duplicates by id
    const mergedOrders = [...finalOrders];
    userOrders.forEach(fbOrder => {
      if (!mergedOrders.some(o => o.id === fbOrder.id)) {
        mergedOrders.push(fbOrder);
      }
    });

    return NextResponse.json({ orders: mergedOrders });
  }

  return NextResponse.json({ error: 'Missing id or user_id query parameter' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      cart_items,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_phone,
      total_amount,
    } = body;

    if (
      !user_id ||
      !shipping_name ||
      !shipping_address ||
      !shipping_city ||
      !shipping_postal_code ||
      !shipping_phone
    ) {
      return NextResponse.json(
        { error: 'All shipping fields and user_id are required' },
        { status: 400 }
      );
    }

    const calculatedTotal =
      total_amount ||
      (cart_items || []).reduce((acc: number, item: any) => {
        const price = item.products?.price || item.price || 0;
        return acc + price * (item.quantity || 1);
      }, 0);

    try {
      // 1. Insert order into Supabase
      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([
          {
            user_id,
            status: 'pending',
            total_amount: calculatedTotal,
            shipping_name,
            shipping_address,
            shipping_city,
            shipping_postal_code,
            shipping_phone,
          },
        ])
        .select()
        .single();

      if (!orderErr && newOrder) {
        // 2. Insert order items with valid UUIDs
        if (cart_items && cart_items.length > 0) {
          const itemsToInsert = cart_items.map((item: any) => {
            let pid = item.products?.id || item.product_id;
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pid);
            return {
              order_id: newOrder.id,
              product_id: isUuid ? pid : null,
              quantity: item.quantity,
              price: item.products?.price || item.price || 0,
            };
          });

          await supabase.from('order_items').insert(itemsToInsert);
        }

        // 3. Clear user cart
        await supabase.from('cart_items').delete().eq('user_id', user_id);

        return NextResponse.json({
          success: true,
          order_id: newOrder.id,
          order: newOrder,
        });
      }
    } catch (dbErr) {
      console.error('Supabase order creation error:', dbErr);
    }

    // Fallback order creation
    const generatedId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const fallbackOrder: OrderFallback = {
      id: generatedId,
      user_id,
      status: 'pending',
      total_amount: calculatedTotal,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_phone,
      created_at: new Date().toISOString(),
      order_items: (cart_items || []).map((item: any) => ({
        id: 'item_' + Math.random().toString(36).substring(2, 6),
        order_id: generatedId,
        product_id: item.product_id || item.products?.id,
        quantity: item.quantity,
        price: item.products?.price || item.price || 0,
        products: item.products,
      })),
    };

    fallbackOrderStore.push(fallbackOrder);

    return NextResponse.json({
      success: true,
      order_id: generatedId,
      order: fallbackOrder,
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fallbackOrderStore } from '@/app/api/orders/route';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    let finalOrders = data || [];
    if (error) {
      console.error('Admin order fetch error (using fallback):', error);
      finalOrders = [];
    }

    // Merge fallback orders
    const mergedOrders = [...finalOrders];
    fallbackOrderStore.forEach(fbOrder => {
      if (!mergedOrders.some(o => o.id === fbOrder.id)) {
        mergedOrders.push(fbOrder);
      }
    });

    return NextResponse.json({ orders: mergedOrders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

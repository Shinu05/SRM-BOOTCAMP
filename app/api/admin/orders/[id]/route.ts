import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fallbackOrderStore } from '@/app/api/orders/route';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      // Try fallback store
      const index = fallbackOrderStore.findIndex(o => o.id === id);
      if (index !== -1) {
        fallbackOrderStore[index].status = status;
        return NextResponse.json({ success: true, order: fallbackOrderStore[index] });
      }

      return NextResponse.json({ error: error?.message || 'Order not found' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}

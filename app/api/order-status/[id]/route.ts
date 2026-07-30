import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json(
      { error: 'Order id is required' },
      { status: 400 }
    );
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status, total_amount, razorpay_order_id, razorpay_payment_id, created_at')
      .eq('id', id)
      .single();

    if (!error && order) {
      return NextResponse.json({
        success: true,
        id: order.id,
        status: order.status,
        razorpay_order_id: order.razorpay_order_id,
        razorpay_payment_id: order.razorpay_payment_id,
        total_amount: order.total_amount,
        order,
      });
    }
  } catch (err) {
    console.error('Error fetching order status from Supabase:', err);
  }

  return NextResponse.json(
    { error: 'Order not found' },
    { status: 404 }
  );
}

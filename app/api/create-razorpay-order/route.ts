import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    // 1. Fetch order from Supabase
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order_id)
        .single();

      if (!error && order) {
        totalAmount = Number(order.total_amount);
      }
    } catch (e) {}

    if (!totalAmount || totalAmount <= 0) {
      totalAmount = body.total_amount || 100;
    }

    // Amount in paise
    const amountInPaise = Math.round(totalAmount * 100);

    // 2. Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order_id,
      notes: {
        internal_order_id: order_id,
      },
    });

    // 3. Save razorpay_order_id back to Supabase
    try {
      await supabase
        .from('orders')
        .update({ razorpay_order_id: rzpOrder.id })
        .eq('id', order_id);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      razorpay_order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}

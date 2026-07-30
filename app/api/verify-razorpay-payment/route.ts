import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment fields' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '17ss05zPn88SXz0ZL5PGbRfk';

    // Official Razorpay Signature Verification using HMAC SHA256
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Signature matches! Update order status to 'paid'
    if (order_id || razorpay_order_id) {
      try {
        let query = supabase.from('orders').update({
          status: 'paid',
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
        });

        if (order_id) {
          query = query.eq('id', order_id);
        } else {
          query = query.eq('razorpay_order_id', razorpay_order_id);
        }

        await query;
      } catch (dbErr) {
        console.error('Error updating order status in Supabase:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

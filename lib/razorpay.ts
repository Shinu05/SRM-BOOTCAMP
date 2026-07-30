import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

export const razorpay = new Razorpay({
  key_id: key_id || 'rzp_test_placeholder',
  key_secret: key_secret || 'placeholder_secret',
});

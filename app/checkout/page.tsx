'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

interface FormErrors {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, currentUser } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.address.trim()) newErrors.address = 'Shipping address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    if (!currentUser) {
      setSubmitError('Please sign in to complete your checkout.');
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.uid,
          cart_items: cartItems,
          shipping_name: formData.name,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postalCode,
          shipping_phone: formData.phone,
          total_amount: subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok && data.order_id) {
        router.push(`/order-confirmation/${data.order_id}`);
      } else {
        setSubmitError(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mb-8">
          Checkout
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-surface border border-border rounded-2xl text-center p-6">
            <ShoppingBag className="w-12 h-12 text-muted mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-sm text-muted mt-1 mb-6">Add items to your cart before proceeding to checkout.</p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Shipping Form */}
            <div className="lg:col-span-7 bg-surface border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-foreground mb-6">
                Shipping Details
              </h2>

              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.name ? 'border-error' : 'border-border'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Shipping Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Commerce St, Suite 400"
                    className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.address ? 'border-error' : 'border-border'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                      className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.city ? 'border-error' : 'border-border'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="10001"
                      className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.postalCode ? 'border-error' : 'border-border'
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.postalCode}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-3 rounded-lg bg-background border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-error' : 'border-border'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span>{submitting ? 'Placing Order...' : 'Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-lg font-bold text-foreground pb-4 border-b border-border">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => {
                  const product = item.products;
                  const imageUrl = product?.image_url || product?.image || '';
                  const price = product?.price || 0;

                  return (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product?.name || 'Item'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {product?.name || 'Item'}
                        </h4>
                        <p className="text-xs text-muted mt-0.5">
                          Qty: {item.quantity} × ${price.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="font-semibold text-success">Free</span>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

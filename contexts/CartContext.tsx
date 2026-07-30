'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChangedListener } from '@/lib/firebase';
import { User } from 'firebase/auth';

export interface CartItemProduct {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  image?: string;
  slug: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products?: CartItemProduct;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  subtotal: number;
  totalCount: number;
  currentUser: User | null;
  effectiveUserId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getGuestUserId(): string {
  if (typeof window === 'undefined') return 'guest_default';
  try {
    let id = localStorage.getItem('srm_guest_user_id');
    if (!id) {
      id = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      localStorage.setItem('srm_guest_user_id', id);
    }
    return id;
  } catch (e) {
    return 'guest_default';
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [guestId, setGuestId] = useState<string>(getGuestUserId);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync client guest ID
  useEffect(() => {
    setGuestId(getGuestUserId());
  }, []);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const effectiveUserId = currentUser?.uid || guestId || 'guest_default';

  // Fetch cart items for effective user ID
  const fetchCartItems = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart_items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectiveUserId) {
      fetchCartItems(effectiveUserId);
    }
  }, [effectiveUserId, fetchCartItems]);

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    const targetUserId = effectiveUserId;

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: targetUserId,
          product_id: productId,
          quantity,
        }),
      });

      if (res.ok) {
        await fetchCartItems(targetUserId);
        setIsCartDrawerOpen(true);
        return true;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
    return false;
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!effectiveUserId) return;

    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, quantity }),
      });

      if (res.ok) {
        await fetchCartItems(effectiveUserId);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!effectiveUserId) return;

    try {
      const res = await fetch(`/api/cart?id=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCartItems(effectiveUserId);
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.products?.price || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        subtotal,
        totalCount,
        currentUser,
        effectiveUserId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

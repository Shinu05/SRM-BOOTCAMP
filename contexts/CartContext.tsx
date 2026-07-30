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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch cart items for current user
  const fetchCartItems = useCallback(async (userId: string) => {
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
    if (currentUser) {
      fetchCartItems(currentUser.uid);
    } else {
      setCartItems([]);
      setIsLoading(false);
    }
  }, [currentUser, fetchCartItems]);

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    if (!currentUser) {
      alert('Please sign in to add items to your cart.');
      return false;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.uid,
          product_id: productId,
          quantity,
        }),
      });

      if (res.ok) {
        await fetchCartItems(currentUser.uid);
        setIsCartDrawerOpen(true);
        return true;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
    return false;
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, quantity }),
      });

      if (res.ok) {
        await fetchCartItems(currentUser.uid);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/cart?id=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCartItems(currentUser.uid);
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

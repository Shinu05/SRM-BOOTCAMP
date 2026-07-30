'use client';

import { createContext } from 'react';

export const CartContext = createContext<unknown>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  return <CartContext.Provider value={null}>{children}</CartContext.Provider>;
}

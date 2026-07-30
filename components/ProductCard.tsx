'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export interface ProductCardProps {
  id?: string;
  image: string;
  name: string;
  price: number | string;
  slug: string;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  slug,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const formattedPrice =
    typeof price === 'number'
      ? `$${price.toFixed(2)}`
      : price.startsWith('$')
      ? price
      : `$${price}`;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id && !slug) return;

    setAdding(true);
    // Use product ID or slug if ID is not passed
    const productId = id || slug;
    const success = await addToCart(productId, 1);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {/* Product Image */}
      <Link href={`/products/${slug}`} className="relative aspect-square w-full overflow-hidden bg-secondary block">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            No Image Available
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          <Link href={`/products/${slug}`}>
            <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {name}
            </h3>
          </Link>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formattedPrice}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground border border-border font-medium text-xs hover:bg-border transition-colors disabled:opacity-50"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
              </>
            )}
          </button>

          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

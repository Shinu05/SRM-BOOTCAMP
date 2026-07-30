import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface ProductCardProps {
  image: string;
  name: string;
  price: number | string;
  slug: string;
}

export default function ProductCard({
  image,
  name,
  price,
  slug,
}: ProductCardProps) {
  const formattedPrice =
    typeof price === 'number'
      ? `$${price.toFixed(2)}`
      : price.startsWith('$')
      ? price
      : `$${price}`;

  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
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
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formattedPrice}
          </p>
        </div>

        {/* View Product Button */}
        <Link
          href={`/products/${slug}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <span>View Product</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

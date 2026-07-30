import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-background to-background py-16 sm:py-24 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Highlight Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border text-xs sm:text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Discover New Arrivals</span>
        </div>

        {/* Bold Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl leading-tight sm:leading-tight">
          Elevate Your Everyday Style with Premium Essentials
        </h1>

        {/* Short Subtext */}
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          Explore our curated collection of high-quality products designed for performance, comfort, and modern elegance.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:opacity-90 transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-secondary text-secondary-foreground border border-border font-semibold text-base hover:bg-surface transition-colors"
          >
            <span>Explore Collection</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

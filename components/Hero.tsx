import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const HERO_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    alt: 'Premium Headphones'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    alt: 'Smart Watch'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop',
    alt: 'Vintage Camera'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    alt: 'Running Shoes'
  }
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-12 sm:pt-20 pb-10 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground max-w-4xl leading-[1.1] animate-reveal-up">
          Explore. Shop. Elevate.
        </h1>

        {/* Short Subtext */}
        <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted max-w-2xl font-medium tracking-tight animate-reveal-up delay-100">
          Curated essentials for the modern lifestyle.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-reveal-up delay-200">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-base hover:scale-105 transition-transform shadow-lg"
          >
            <span>Shop Now</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-semibold text-base hover:bg-secondary/80 transition-colors"
          >
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Hero Images Grid */}
        <div className="mt-12 sm:mt-16 w-full px-2 sm:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-reveal-up delay-300">
            {HERO_IMAGES.map((img, idx) => (
              <div 
                key={img.id} 
                className={`relative aspect-square sm:aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary shadow-xl transition-transform duration-500 hover:scale-[1.02] ${
                  idx === 0 || idx === 3 ? 'md:translate-y-8' : 'md:-translate-y-4'
                }`}
              >
                <div className="absolute inset-0 bg-black/5 z-10 rounded-[2rem] pointer-events-none transition-colors duration-300 hover:bg-transparent" />
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={true}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

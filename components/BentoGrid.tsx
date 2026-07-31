import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Design that speaks.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl">
          Discover a curated selection of essentials tailored for the modern lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
        {/* Large Block: Premium Audio */}
        <Link
          href="/products?category=Audio"
          className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-surface p-8 md:col-span-2 md:row-span-2 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-500 min-h-[400px] md:min-h-0"
        >
          <div className="absolute inset-0 z-0 bg-secondary/20">
            <Image
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
              alt="Premium Audio"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Premium Audio</h3>
            <p className="text-white/80 max-w-sm mb-6 text-sm sm:text-base">
              Immerse yourself in crystal-clear sound with industry-leading active noise cancellation.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
              <span>Shop Audio</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Wide Block: Smart Wearables */}
        <Link
          href="/products?category=Wearables"
          className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-surface p-8 md:col-span-2 md:row-span-1 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-500 min-h-[250px] md:min-h-0"
        >
          <div className="absolute inset-0 z-0 bg-secondary/20">
            <Image
              src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
              alt="Smart Wearables"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">Smart Wearables</h3>
            <p className="text-white/80 text-sm sm:text-base mb-4 max-w-md">
              Track your fitness, health, and daily activities with precision.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
              <span>Shop Wearables</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Small Block 1: Everyday Carry */}
        <Link
          href="/products?category=Bags"
          className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-surface p-6 md:col-span-1 md:row-span-1 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-500 min-h-[250px] md:min-h-0"
        >
          <div className="absolute inset-0 z-0 bg-secondary/20">
            <Image
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
              alt="Everyday Carry"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">Everyday Carry</h3>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 group-hover:text-white transition-all">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Small Block 2: Home Essentials */}
        <Link
          href="/products?category=Home"
          className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-surface p-6 md:col-span-1 md:row-span-1 shadow-sm border border-border/50 hover:shadow-lg transition-all duration-500 min-h-[250px] md:min-h-0"
        >
          <div className="absolute inset-0 z-0 bg-secondary/20">
            <Image
              src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80"
              alt="Home Essentials"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">Home Office</h3>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 group-hover:text-white transition-all">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

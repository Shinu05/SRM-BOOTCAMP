import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

const placeholderProducts = [
  {
    slug: "wireless-noise-canceling-headphones",
    name: "Wireless Noise-Canceling Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "minimalist-leather-watch",
    name: "Minimalist Leather Watch",
    price: 149.50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "ergonomic-mechanical-keyboard",
    name: "Ergonomic Mechanical Keyboard",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "smart-fitness-tracker",
    name: "Smart Fitness Tracker Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "premium-canvas-backpack",
    name: "Premium Canvas Everyday Backpack",
    price: 89.95,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "studio-wireless-earbuds",
    name: "Studio Pro Wireless Earbuds",
    price: 159.00,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "sleek-desk-lamp",
    name: "Sleek Minimalist LED Desk Lamp",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&auto=format&fit=crop&q=80",
  },
  {
    slug: "portable-bluetooth-speaker",
    name: "Waterproof Portable Bluetooth Speaker",
    price: 119.00,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <Hero />

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border text-xs sm:text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Featured Products
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-xl">
              Explore top-rated gear selected for craftsmanship, modern design, and everyday durability.
            </p>
          </div>

          {/* Responsive Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {placeholderProducts.map((product) => (
              <ProductCard
                key={product.slug}
                image={product.image}
                name={product.name}
                price={product.price}
                slug={product.slug}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

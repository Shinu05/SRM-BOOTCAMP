import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import BentoGrid from "@/components/BentoGrid";
import Features from "@/components/Features";
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
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        <Hero />
        
        <BentoGrid />

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 mb-10">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Featured Products.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl">
              Explore top-rated gear selected for craftsmanship, modern design, and everyday durability.
            </p>
          </div>

          {/* Responsive Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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

        <Features />
      </main>

      <Footer />
    </div>
  );
}

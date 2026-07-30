'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, Filter, Loader2 } from 'lucide-react';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  description: string;
  category: string;
}

const CATEGORIES = ['All', 'Audio', 'Accessories', 'Electronics', 'Wearables', 'Bags', 'Home'];

export default function ProductsClient() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchProducts = async (searchQuery: string, categoryFilter: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (categoryFilter && categoryFilter !== 'All') params.set('category', categoryFilter);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search, category);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Full Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Shop All Products
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted max-w-xl">
          Discover our full range of premium essentials, crafted for performance and everyday durability.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-sm">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-muted flex-shrink-0 hidden sm:block ml-2" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <span className="text-sm font-medium">Loading catalog...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border rounded-2xl p-6">
          <p className="text-lg font-bold text-foreground">No products found</p>
          <p className="text-sm text-muted mt-1">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              image={product.image_url || product.image || ''}
              name={product.name}
              price={product.price}
              slug={product.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

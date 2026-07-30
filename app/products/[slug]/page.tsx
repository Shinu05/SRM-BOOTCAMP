import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/app/api/products/[slug]/route";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const imageUrl = product.image || product.image_url;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Store`,
      description: product.description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!product ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted mb-6">The product you are looking for does not exist or has been removed.</p>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Back to Products
            </Link>
          </div>
        ) : (
          <ProductDetailClient product={product} />
        )}
      </main>

      <Footer />
    </div>
  );
}

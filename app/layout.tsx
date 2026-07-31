import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ATLAS",
    default: "ATLAS | Explore. Shop. Elevate.",
  },
  description:
    "Explore our curated collection of high-quality products designed for performance, comfort, and modern elegance.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "ATLAS | Explore. Shop. Elevate.",
    description:
      "Explore our curated collection of high-quality products designed for performance, comfort, and modern elegance.",
    siteName: "ATLAS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLAS | Explore. Shop. Elevate.",
    description:
      "Explore our curated collection of high-quality products designed for performance, comfort, and modern elegance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

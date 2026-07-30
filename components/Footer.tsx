import { Store } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-border py-8 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Store Brand */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
            <Store className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">Store</span>
        </div>

        {/* Copyright Line */}
        <p className="text-xs sm:text-sm text-muted">
          &copy; {currentYear} Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

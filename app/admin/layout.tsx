'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChangedListener, signOutUser } from '@/lib/firebase';
import { isAdmin } from '@/lib/isAdmin';
import { User } from 'firebase/auth';
import {
  ShieldX,
  ArrowLeft,
  Loader2,
  Search,
  Bell,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

const navTabs = [
  { href: '/admin', label: 'Home' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted" />
      </div>
    );
  }

  if (!currentUser || !isAdmin(currentUser.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full bg-surface border border-border rounded-xl p-8 text-center flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-error/10 text-error">
            <ShieldX className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Not authorized</h1>
          <p className="text-sm text-muted leading-relaxed">
            You do not have permission to access the admin area. Please sign in with an admin account.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const firstName = currentUser.displayName?.split(' ')[0] || 'Admin';

  // Determine the current page title
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/orders')) return 'Orders';
    if (pathname.startsWith('/admin/products')) return 'Products';
    return 'Admin';
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col admin-theme bg-background text-foreground transition-colors duration-300">

      {/* ═══ Primary Navigation Bar ═══ */}
      <header className="sticky top-0 z-40 bg-surface/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Left: Brand + Nav Tabs */}
            <div className="flex items-center gap-6">
              {/* Brand */}
              <Link href="/admin" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
                <Image src="/logo.jpg" alt="Atlas Logo" width={120} height={120} className="object-cover w-10 h-10 rounded-full shadow-sm" priority />
              </Link>

              {/* Nav Tabs */}
              <nav className="hidden sm:flex items-center gap-0.5">
                {navTabs.map((tab) => {
                  const isActive =
                    tab.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(tab.href);

                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${isActive
                          ? 'bg-foreground text-background'
                          : 'text-muted hover:text-foreground'
                        }`}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
                <Link
                  href="/"
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-muted hover:text-foreground transition-all"
                >
                  Storefront
                </Link>
              </nav>
            </div>

            {/* Right: Search + Notifications + Avatar */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              {searchOpen ? (
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    placeholder="Search..."
                    className="w-44 pl-3 pr-8 py-1.5 rounded-full bg-background border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full text-muted hover:text-foreground hover:bg-background transition-colors"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Notifications */}
              <button
                className="relative p-2 rounded-full text-muted hover:text-foreground hover:bg-background transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent ring-2 ring-surface" />
              </button>

              {/* User Avatar */}
              <button
                onClick={handleLogout}
                className="ml-1 shrink-0"
                title={`Signed in as ${currentUser.displayName || 'Admin'} — Click to logout`}
              >
                {currentUser.photoURL ? (
                  <Image
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Admin'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-border hover:border-accent transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold border-2 border-border hover:border-accent transition-colors">
                    {firstName.charAt(0)}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tab nav (visible on small screens) */}
      <div className="sm:hidden flex items-center gap-0.5 px-4 py-2 border-b border-border bg-surface overflow-x-auto scrollbar-none">
        {navTabs.map((tab) => {
          const isActive =
            tab.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted hover:text-foreground'
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-muted hover:text-foreground transition-all ml-auto"
        >
          Store
        </Link>
      </div>

      {/* ═══ Sub-header: Page Title + Controls ═══ */}
      <div className="border-b border-border/50 bg-surface/40 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-muted">
              {today}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-muted">
              Daily ▾
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

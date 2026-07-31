'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  Clock,
  CreditCard,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/products'),
        ]);

        let totalOrders = 0;
        let pendingOrders = 0;
        let paidOrders = 0;
        let totalProducts = 0;

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = ordersData.orders || [];
          totalOrders = orders.length;
          pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
          paidOrders = orders.filter((o: any) => o.status === 'paid').length;
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          totalProducts = (productsData.products || []).length;
        }

        setStats({ totalOrders, pendingOrders, paidOrders, totalProducts });
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Pending',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Paid',
      value: stats.paidOrders,
      icon: CreditCard,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted">Overview of your store</p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className={`p-1.5 rounded-md ${card.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {card.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Loader2,
  ChevronDown,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_city: string;
  shipping_phone: string;
  created_at: string;
  order_items?: any[];
}

const STATUS_OPTIONS = ['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  paid: { icon: CreditCard, color: 'text-success', bg: 'bg-success/10' },
  shipped: { icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  delivered: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
  cancelled: { icon: XCircle, color: 'text-error', bg: 'bg-error/10' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Orders</h1>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 rounded-lg bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-10 text-center">
          <p className="text-sm text-muted">No orders found.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border/50 shadow-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wider text-right">Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const sc = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = sc.icon;

                  return (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-background/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium truncate max-w-[160px]">
                            {order.shipping_name || 'N/A'}
                          </span>
                          <span className="text-[11px] text-muted truncate max-w-[160px]">
                            {order.shipping_city || ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-foreground font-medium">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${sc.bg} ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted text-xs hidden sm:table-cell">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="relative inline-block">
                          {updatingId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted" />
                          ) : (
                            <>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="appearance-none pl-2 pr-6 py-1 rounded-md bg-background border border-border text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                              >
                                {STATUS_OPTIONS.filter((s) => s !== 'all').map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 text-muted absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

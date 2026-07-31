'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  paid: '#10b981',
  shipped: '#3b82f6',
  delivered: '#8b5cf6',
  cancelled: '#ef4444',
};

const CHART_PALETTE = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '12px',
  color: '#0f172a',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
};

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/orders')
        ]);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute metrics and charts from real data
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';

  // Format dates for charts (e.g. "Jul 1")
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Unknown';
    }
  };

  // 1. Revenue Timeline
  const revenueTimeline = (() => {
    const dailyMap: Record<string, number> = {};
    orders.forEach(o => {
      const day = formatDate(o.created_at);
      dailyMap[day] = (dailyMap[day] || 0) + Number(o.total_amount || 0);
    });
    // Convert to array and reverse to show chronological order (assuming API returns descending)
    return Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue })).reverse();
  })();

  // 2. Order Status Breakdown
  const orderStatusData = (() => {
    const statusMap: Record<string, number> = {};
    orders.forEach(o => {
      const s = o.status || 'pending';
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  })();

  // 3. Order Trend (Line Chart by Status)
  const orderTrendData = (() => {
    const trendMap: Record<string, Record<string, number>> = {};
    orders.forEach(o => {
      const day = formatDate(o.created_at);
      if (!trendMap[day]) trendMap[day] = { pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 };
      const s = o.status || 'pending';
      trendMap[day][s] = (trendMap[day][s] || 0) + 1;
    });
    return Object.entries(trendMap).map(([date, counts]) => ({ date, ...counts })).reverse();
  })();

  // 4. Revenue by Status
  const revenueByStatusData = (() => {
    const revMap: Record<string, number> = {};
    orders.forEach(o => {
      const s = o.status || 'pending';
      revMap[s] = (revMap[s] || 0) + Number(o.total_amount || 0);
    });
    return Object.entries(revMap).map(([name, value]) => ({ name, value }));
  })();

  // 5. Products by Category
  const categoryData = (() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  })();

  // 6. Stock Levels (Top 10 lowest stock items)
  const stockData = [...products]
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, 10)
    .map(p => ({ name: p.name.substring(0, 20) + (p.name.length > 20 ? '...' : ''), stock: Number(p.stock || 0) }));

  // 7. Price Distribution
  const priceRangeData = (() => {
    const buckets: Record<string, number> = {
      '$0-25': 0,
      '$25-50': 0,
      '$50-100': 0,
      '$100-200': 0,
      '$200+': 0,
    };
    products.forEach(p => {
      const price = Number(p.price || 0);
      if (price < 25) buckets['$0-25']++;
      else if (price < 50) buckets['$25-50']++;
      else if (price < 100) buckets['$50-100']++;
      else if (price < 200) buckets['$100-200']++;
      else buckets['$200+']++;
    });
    return Object.entries(buckets).map(([name, count]) => ({ name, count })).filter(b => b.count > 0);
  })();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted mt-0.5">Store analytics overview with real-time data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: String(totalOrders), accent: '#8b5cf6' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, accent: '#10b981' },
          { label: 'Products', value: String(products.length), accent: '#6366f1' },
          { label: 'Avg. Order', value: `$${avgOrder}`, accent: '#f59e0b' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-2 transition-shadow hover:shadow-md">
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider">{kpi.label}</span>
            <span className="text-xl font-bold text-foreground">{kpi.value}</span>
            <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: kpi.accent, opacity: 0.8 }} />
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-10 text-center flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-foreground">No orders yet.</p>
          <p className="text-xs text-muted">Complete a checkout to see real-time data populate here.</p>
        </div>
      ) : (
        <>
          {/* Row 1: Revenue Area Chart + Order Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Revenue Trend</h2>
                <p className="text-[11px] text-muted">Daily revenue over time</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueTimeline}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Order Status</h2>
                <p className="text-[11px] text-muted">Distribution breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderStatusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Order Trend Line Chart + Revenue by Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Orders Over Time</h2>
                <p className="text-[11px] text-muted">Order count by status per period</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={orderTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="delivered" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                  <Line type="monotone" dataKey="shipped" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Revenue by Status</h2>
                <p className="text-[11px] text-muted">Dollar amount per status</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={revenueByStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {revenueByStatusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue']}
                  />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Row 3: Products by Category + Stock Levels */}
      {products.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
            <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Products by Category</h2>
                <p className="text-[11px] text-muted">Catalog breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139,92,246,0.06)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Stock Alerts</h2>
                <p className="text-[11px] text-muted">Lowest inventory items</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stockData} layout="vertical" barCategoryGap="16%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                  <Bar dataKey="stock" radius={[0, 6, 6, 0]}>
                    {stockData.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 4: Price Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
            <div className="bg-surface border border-border/50 shadow-sm rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Price Distribution</h2>
                <p className="text-[11px] text-muted">Products by price range</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={priceRangeData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {priceRangeData.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[(i + 3) % CHART_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useNavigate } from 'react-router-dom';
import { clearAdminSession, getAdminSession } from './AdminLogin';
import { useStore } from '../../context/StoreContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import './AdminDashboard.css';


/* ══════════════════════════════════════════════════
   SVG ICONS
   ══════════════════════════════════════════════════ */
const Icon = {
  home:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  products:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  inventory: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  rewards:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  orders:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  employees: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  settings:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  logout:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  search:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  coffee:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  users:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  trendUp:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  box:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  alert:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

/* ══════════════════════════════════════════════════
   NAV CONFIG
   ══════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'home',      label: 'Home',      icon: Icon.home },
  { id: 'products',  label: 'Products',  icon: Icon.products },
  { id: 'inventory', label: 'Inventory', icon: Icon.inventory },
  { id: 'rewards',   label: 'Rewards',   icon: Icon.rewards },
  { id: 'orders',    label: 'Orders',    icon: Icon.orders },
  { id: 'employees', label: 'Employees', icon: Icon.employees },
  { id: 'settings',  label: 'Settings',  icon: Icon.settings },
];

/* ══════════════════════════════════════════════════
   HELPER COMPONENTS
   ══════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    'Active':       'badge--active',
    'Inactive':     'badge--inactive',
    'available':    'badge--active',
    'unavailable':  'badge--inactive',
    'In Stock':     'badge--active',
    'Low Stock':    'badge--warn',
    'Out of Stock': 'badge--danger',
    'Completed':    'badge--active',
    'Pending':      'badge--pending',
    'Preparing':    'badge--warn',
    'Cancelled':    'badge--danger',
  };
  return <span className={`adm-badge ${map[status] || ''}`}>{status}</span>;
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="adm-stat" style={{ '--stat-color': color }}>
      <div className="adm-stat__icon">{icon}</div>
      <div className="adm-stat__body">
        <span className="adm-stat__label">{label}</span>
        <span className="adm-stat__value">{value}</span>
        {sub && <span className="adm-stat__sub">{sub}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="adm-section-hdr">
      <h2 className="adm-section-title">{title}</h2>
      {action && (
        <button className="adm-btn-add" onClick={onAction}>
          {Icon.plus} {action}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   REUSABLE: DELETE CONFIRM MODAL
   Shows a centered overlay dialog instead of an
   awkward inline confirm row.
   ══════════════════════════════════════════════════ */
function DeleteConfirmModal({ name, onConfirm, onCancel, title, message, confirmLabel }) {
  // Use a portal so the backdrop renders into document.body,
  // escaping any parent overflow / transform / stacking-context.
  return createPortal(
    <div className="dcm-backdrop" onClick={onCancel}>
      <div className="dcm-dialog" onClick={e => e.stopPropagation()}>
        <div className="dcm-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h3 className="dcm-title">{title || 'Delete item?'}</h3>
        <p className="dcm-msg">{message || <>Are you sure you want to delete <strong>&ldquo;{name}&rdquo;</strong>? This action cannot be undone.</>}</p>
        <div className="dcm-actions">
          <button className="dcm-btn dcm-btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="dcm-btn dcm-btn--delete" onClick={onConfirm}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            {confirmLabel || 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body   // ← renders outside any parent container
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="adm-search">
      {Icon.search}
      <input
        type="text"
        placeholder={placeholder || 'Search…'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: HOME (OVERVIEW)
   ══════════════════════════════════════════════════ */
/* ── Custom Tooltip for area chart ── */
function SalesTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#1a1a1a', color: '#fff',
      padding: '6px 12px', borderRadius: '8px',
      fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.4,
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    }}>
      <div>₱{Number(payload[0].value).toLocaleString()}</div>
      <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400 }}>{label}</div>
    </div>
  );
}

/* ── Countdown ── (kept for Active promos card) */
function Countdown() {
  const target = new Date(); target.setDate(target.getDate() + 30);
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    return { d: Math.floor(diff/86400000), h: Math.floor(diff/3600000)%24, m: Math.floor(diff/60000)%60, s: Math.floor(diff/1000)%60 };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return <span className="home-promo-countdown">{t.d}d {t.h}h {t.m}m {t.s}s left</span>;
}

function HomeSection() {
  const { orders, inventory } = useStore();
  const session = getAdminSession();
  const adminName = session?.name || 'Admin';
  const initials = adminName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  /* Clock */
  const now = new Date();
  const dayFmt  = now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeFmt = now.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true });
  const [clock, setClock] = useState(timeFmt);
  useEffect(() => {
    const id = setInterval(() => setClock(new Date().toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })), 30000);
    return () => clearInterval(id);
  }, []);

  /* ── Stats ── */
  const completedOrders  = orders.filter(o => o.status === 'Completed');
  const cancelledOrders  = orders.filter(o => o.status === 'Cancelled');
  const pendingOrders    = orders.filter(o => o.status === 'Pending');
  const totalSales       = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const customerCount    = completedOrders.length;
  const avgMeal          = customerCount > 0 ? (totalSales / customerCount).toFixed(2) : '0.00';
  const salesFmt         = totalSales >= 1000 ? `${(totalSales / 1000).toFixed(1)}k` : totalSales.toString();

  /* ── Stock alerts ── */
  const rawStock = inventory.map(i => ({
    name:   i.name,
    pct:    i.threshold > 0 ? Math.min(100, Math.round((i.qty / i.threshold) * 100)) : 100,
    status: i.status === 'Out of Stock' ? 'Out of stock'
          : i.status === 'Low Stock'    ? 'Low on stock'
          :                               'Sufficient stock',
    color:  i.status === 'Out of Stock' ? '#ef4444'
          : i.status === 'Low Stock'    ? '#f59e0b'
          :                               '#22c55e',
  }));
  const stockItems = rawStock.length > 0 ? rawStock.slice(0, 4) : [
    { name: 'All items', pct: 100, status: 'Sufficient stock', color: '#22c55e' },
  ];

  /* ── Sales goal (─ Recharts area chart) ── */
  const salesGoal = 30000;
  const salesPct  = Math.min(100, Math.round((totalSales / salesGoal) * 100));

  /* Build 4×10-day buckets: 1-10 Apr, 11-20 Apr, 21-30 Apr, 1-10 May */
  const labels = ['1 - 10 Apr', '11 - 20 Apr', '21 - 30 Apr', '1 - 10 May'];
  const buckets = [0, 0, 0, 0];
  orders.forEach(o => {
    const d = new Date(o.createdAt || Date.now());
    const day = d.getDate();
    if (d.getMonth() === 3) {          // April (0-indexed)
      if (day <= 10)  buckets[0] += (o.total || 0);
      else if (day <= 20) buckets[1] += (o.total || 0);
      else buckets[2] += (o.total || 0);
    } else if (d.getMonth() === 4) {   // May
      if (day <= 10) buckets[3] += (o.total || 0);
    }
  });
  // If no real data, show demo curve
  const hasData = buckets.some(v => v > 0);
  const chartData = labels.map((label, i) => ({
    label,
    value: hasData ? buckets[i] : [4000, 10000, 23849, 18000][i],
  }));

  /* ── Target sales (semicircle Pie) ── */
  const pieFilled   = salesPct;
  const pieEmpty    = 100 - salesPct;
  const pieData = [
    { name: 'filled', value: pieFilled   },
    { name: 'gap',    value: pieEmpty     },
    { name: 'hidden', value: 100          }, // bottom half hidden
  ];
  const PIE_COLORS = ['#6b4226', '#e8e0d8', 'transparent'];

  /* legend counts */
  const salesCount    = customerCount;
  const inactiveCount = pendingOrders.length;
  const offlineCount  = cancelledOrders.length;

  /* ── Month selector (UI-only) ── */
  const [period, setPeriod] = useState('Month');

  return (
    <div className="adm-content home-content">

      {/* ── Header row ── */}
      <div className="home-header">
        <div>
          <h1 className="adm-page-title">Dashboard</h1>
          <p className="home-datetime">{dayFmt} | {clock}</p>
        </div>
        <div className="home-user-info">
          <span className="home-username">{adminName}</span>
          <div className="home-avatar">{initials}</div>
        </div>
      </div>

      {/* ── Row 1: Stat cards + Stock alert ── */}
      <div className="home-stats-row">
        {/* 2×3 grid of stat cards */}
        <div className="home-stats-left">
          {/* Row A */}
          <div className="home-stat-card">
            <p className="home-stat-label">Customers served</p>
            <p className="home-stat-value">{customerCount}</p>
            <p className="home-stat-trend"><span className="trend-arrow">&#9650; 30.00%</span> higher than average sales</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Sales</p>
            <p className="home-stat-value">₱{salesFmt}</p>
            <p className="home-stat-trend"><span className="trend-arrow">&#9650; 30.00%</span> higher than average sales</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Average Meal Value</p>
            <p className="home-stat-value">{avgMeal}</p>
            <p className="home-stat-trend"><span className="trend-arrow">&#9650; 30.00%</span> higher than average sales</p>
          </div>
          {/* Row B */}
          <div className="home-stat-card">
            <p className="home-stat-label">Refunds</p>
            <p className="home-stat-value">0</p>
            <p className="home-stat-trend"><span className="trend-arrow">&#9650; 30.00%</span> higher than average sales</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Voids</p>
            <p className="home-stat-value">0</p>
            <p className="home-stat-trend"><span className="trend-arrow">&#9650; 30.00%</span> higher than average sales</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Total Orders</p>
            <p className="home-stat-value">{orders.length}</p>
            <p className="home-stat-trend"><span className="trend-arrow">&#9650; 30.00%</span> higher than average sales</p>
          </div>
        </div>

        {/* Stock alert */}
        <div className="home-stock-alert adm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Stock alert</h3>
            <button style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#6b4226', fontWeight: 600, cursor: 'pointer' }}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stockItems.map(item => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a' }}>{item.name}</span>
                  <span style={{ fontSize: '0.72rem', color: item.color, fontWeight: 600 }}>{item.status}</span>
                </div>
                <div style={{ height: '8px', borderRadius: '99px', background: '#f0ebe4', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, borderRadius: '99px', background: '#6b4226', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Area chart + Donut gauge ── */}
      <div className="home-charts-row">

        {/* Sales goal area chart */}
        <div className="adm-card home-chart-card home-chart-card--wide">
          <p className="home-chart-subtitle">Statistics</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Sales goal</h3>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={{
                fontSize: '0.8rem', padding: '4px 10px', border: '1.5px solid #e0d9d0',
                borderRadius: '8px', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                color: '#5a5450', background: '#fff', outline: 'none',
              }}
            >
              <option>Month</option>
              <option>Week</option>
              <option>Year</option>
            </select>
          </div>

          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>{salesPct}%</p>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#7b9cef" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7b9cef" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0ebe4" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#a0a0a0' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#a0a0a0' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v/1000}k` : v}
              />
              <Tooltip content={<SalesTooltip />} cursor={{ stroke: '#6b4226', strokeWidth: 1, strokeDasharray: '4 2' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#5b7fe8"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={false}
                activeDot={{ r: 6, fill: '#4060cf', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Target sales semicircle gauge */}
        <div className="adm-card home-chart-card home-gauge-card">
          <p className="home-chart-subtitle">Statistics</p>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 8px' }}>Target sales</h3>

          <div className="home-gauge-wrap">
            {/* Recharts PieChart as semicircle: startAngle 180, endAngle 0 */}
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="82%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#6b4226" />
                  <Cell fill="#e8e0d8" />
                  <Cell fill="transparent" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="home-gauge-label">
              <span style={{ fontSize: '0.72rem', color: '#7a7472' }}>Total Count</span>
              <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 }}>₱{salesFmt}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="home-gauge-legend">
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', marginRight: 5 }} />Sales <strong>{salesCount}</strong></span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #a0a0a0', marginRight: 5 }} />Inactive <strong>{inactiveCount}</strong></span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#f9a8d4', marginRight: 5 }} />Offline <strong>{offlineCount}</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════
   SECTION: PRODUCTS  (card layout + side panel)
   ══════════════════════════════════════════════════ */

/* Category tab config — uses real icons from /public */
const CATEGORIES = [
  { id: 'All',      label: 'All',      icon: '/login-icon.png' },
  { id: 'Coffee',   label: 'Coffee',   icon: '/icon_coffee.png' },
  { id: 'Milktea',  label: 'Milktea',  icon: '/icon_milktea.png' },
  { id: 'Soda',     label: 'Soda',     icon: '/soda-icon.png' },
  { id: 'Mocktail', label: 'Mocktail', icon: '/mocktail.png' },
  { id: 'Sides',    label: 'Sides',    icon: '/sides-icon.png' },
];

/* Ingredients list populated dynamically from inventory; static fallback below */
const INGREDIENTS_FALLBACK = ['Espresso Shot', 'Milk', 'Coffee Beans', 'Orange Juice', 'Lemon', 'Brown Sugar', 'Cream'];
const QTY_UNITS = ['10ml', '20ml', '50ml', '100ml', '200ml', '1 shot', '1 scoop', '1 pc', '1 tbsp'];
const SIZE_OPTIONS_OZ    = ['8oz', '12oz', '16oz', '22oz'];
const SIZE_OPTIONS_LABEL = ['Small', 'Medium', 'Large', 'XXL'];
function getSizeOptions(sizeType) {
  return sizeType === 'S/M/L' ? SIZE_OPTIONS_LABEL : SIZE_OPTIONS_OZ;
}

/* Image placeholder */
function ImgPlaceholder() {
  return (
    <div className="prod-img-placeholder">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b0a89e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    </div>
  );
}

/* Size badge chip */
function SizeChip({ label }) {
  const isBrown = ['8oz','12oz','16oz','22oz'].includes(label);
  return <span className={`prod-chip ${isBrown ? 'prod-chip--brown' : 'prod-chip--outline'}`}>{label}</span>;
}

/* Temperature badge chip */
function TempChip({ label }) {
  const isHot = label === 'Hot';
  return <span className={`prod-chip ${isHot ? 'prod-chip--brown' : 'prod-chip--outline'}`}>{label}</span>;
}

/* Product card */
function ProductCard({ product, onEdit, onDelete }) {
  const sizes = product.sizes || [];
  const temps = product.temps || [];
  const hasSizes = sizes.length > 0;

  return (
    <div className="prod-card">
      <div className="prod-card__img">
        {product.image
          ? <img src={product.image} alt={product.name} />
          : <ImgPlaceholder />
        }
      </div>
      <div className="prod-card__info">
        <p className="prod-card__name">{product.name}</p>
        <p className="prod-card__price">₱ {product.price.toFixed(2)}</p>
        <div className="prod-card__avail">
          <span className={`prod-avail-badge ${product.status === 'available' ? 'prod-avail-badge--green' : 'prod-avail-badge--red'}`}>
            {product.status.toUpperCase()}
          </span>
        </div>
      </div>
      {(hasSizes || sizes.length > 0) && (
        <div className="prod-card__meta">
          <span className="prod-card__meta-label">Size</span>
          <div className="prod-card__chips">
            {sizes.map(s => <SizeChip key={s} label={s} />)}
          </div>
        </div>
      )}
      {temps.length > 0 && (
        <div className="prod-card__meta">
          <span className="prod-card__meta-label">Temperature</span>
          <div className="prod-card__chips">
            {temps.map(t => <TempChip key={t} label={t} />)}
          </div>
        </div>
      )}
      <div className="prod-card__actions">
        <button className="adm-action-btn adm-action-btn--red"  onClick={() => onDelete(product.id)} title="Delete">{Icon.trash}</button>
        <button className="adm-action-btn adm-action-btn--blue" onClick={() => onEdit(product)}      title="Edit">{Icon.edit}</button>
      </div>
    </div>
  );
}

/* ── Add/Edit Product Side Panel ── */
function ProductPanel({ open, mode, product, onClose, onSave, ingredientsList = INGREDIENTS_FALLBACK }) {
  const fileInputRef               = useRef(null);
  const [activeTab,    setActiveTab]   = useState('info');
  const [productName,  setProductName] = useState('');
  const [pCategory,    setPCategory]   = useState('Beverage');
  const [bevType,      setBevType]     = useState('Coffee');
  const [temperature,  setTemperature] = useState([]);
  const [imageTab,     setImageTab]    = useState('upload');
  const [imagePreview, setImagePreview]= useState(null);
  const [imageUrl,     setImageUrl]    = useState('');
  const [available,    setAvailable]   = useState(true);
  const [sizeType,     setSizeType]    = useState('Oz');
  const [variants,     setVariants]    = useState([{ size: '12oz', price: '120.00' }]);
  const [ingredients,  setIngredients] = useState([{ ingredient: 'Espresso Shot', qty: '10ml' }]);

  /* Price field for non-variant (food) products */
  const [basePrice, setBasePrice] = useState('0.00');

  /* Proper reset via useEffect */
  useEffect(() => {
    if (!open) return;
    setActiveTab('info');
    setProductName(product?.name   || '');
    const isSides = product?.category === 'Sides';
    setPCategory(isSides ? 'Food' : 'Beverage');
    setBevType(
      product?.category === 'Milktea'  ? 'Milktea'  :
      product?.category === 'Soda'     ? 'Soda'     :
      product?.category === 'Mocktail' ? 'Mocktail' : 'Coffee'
    );
    setTemperature(product?.temps  || []);
    setAvailable(product?.status  !== 'unavailable');
    setImagePreview(product?.image || null);
    setImageUrl('');
    const priceFallback = String((product?.price ?? 0).toFixed(2));
    setBasePrice(priceFallback);
    const newSizeType = (product?.sizes || []).some(s => SIZE_OPTIONS_LABEL.includes(s)) ? 'S/M/L' : 'Oz';
    setSizeType(newSizeType);
    if ((product?.variants || []).length) {
      /* Restore full variant rows (with variantId + price) from API data */
      setVariants(product.variants.map(v => ({
        variantId: v.variantId,
        size:      v.size || (newSizeType === 'S/M/L' ? 'Small' : '12oz'),
        price:     String((v.price ?? 0).toFixed(2)),
      })));
    } else if ((product?.sizes || []).length) {
      setVariants(product.sizes.map(s => ({ size: s, price: priceFallback })));
    } else {
      setVariants([{ size: newSizeType === 'S/M/L' ? 'Small' : '12oz', price: priceFallback }]);
    }
    setIngredients([{ ingredient: 'Espresso Shot', qty: '10ml' }]);
  }, [open, product]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (f) setImagePreview(URL.createObjectURL(f));
  }

  const [nameError, setNameError] = useState('');

  function handleSave() {
    if (!productName.trim()) {
      setNameError('Product name is required.');
      return;
    }
    setNameError('');
    const isFood = pCategory === 'Food';
    onSave({
      id:       product?.id || `p${Date.now()}`,
      name:     productName.trim(),
      category: isFood ? 'Sides' : bevType,
      price:    parseFloat(basePrice) || parseFloat(variants[0]?.price || 0),
      sizes:    isFood ? [] : variants.map(v => v.size),
      temps:    temperature,
      status:   available ? 'available' : 'unavailable',
      image:    imageTab === 'url' ? imageUrl : imagePreview,
      /* Pass full variant rows so the API can persist them */
      variants: isFood
        ? [{ size: null, price: parseFloat(basePrice) }]
        : variants.map(v => ({
            variantId: v.variantId ?? null,
            size:      v.size,
            price:     parseFloat(v.price) || 0,
          })),
    });
    /* onClose is intentionally NOT called here — the parent (ProductsSection)
       closes the panel after showing a success toast */
  }

  function toggleTemp(t) {
    setTemperature(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  }

  function addVariant()      { setVariants(v => [...v, { size: sizeType === 'S/M/L' ? 'Small' : '8oz', price: '0.00' }]); }
  function removeVariant(i)  { setVariants(v => v.filter((_, idx) => idx !== i)); }
  function updateVariant(i, field, val) {
    setVariants(v => v.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  function addIngredient()      { setIngredients(v => [...v, { ingredient: 'Milk', qty: '10ml' }]); }
  function removeIngredient(i)  { setIngredients(v => v.filter((_, idx) => idx !== i)); }
  function updateIngredient(i, field, val) {
    setIngredients(v => v.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  const isEdit = mode === 'edit';

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && <div className="pp-backdrop" onClick={onClose} />}

      <aside className={`pp-panel ${open ? 'pp-panel--open' : ''}`}>
        <div className="pp-inner">
          {/* Header */}
          <div className="pp-header">
            <h2 className="pp-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          </div>

          {/* Tabs */}
          <div className="pp-tabs">
            {['info', 'variants', 'recipe'].map(t => (
              <button
                key={t}
                className={`pp-tab ${activeTab === t ? 'pp-tab--active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'info' ? 'Product Info' : t === 'variants' ? 'Variants' : 'Recipe'}
              </button>
            ))}
          </div>

          {/* ── TAB: Product Info ── */}
          {activeTab === 'info' && (
            <div className="pp-body">
              <div className="pp-field">
                <label className="pp-label">Product Name</label>
                <input
                  className="pp-input"
                  type="text"
                  placeholder="e.g. Hazelnut Latte"
                  value={productName}
                  onChange={e => { setProductName(e.target.value); if (nameError) setNameError(''); }}
                  style={nameError ? { borderColor: '#ef4444' } : {}}
                />
                {nameError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{nameError}</p>}
              </div>

              <div className="pp-field">
                <label className="pp-label">Product Category</label>
                <select className="pp-select" value={pCategory} onChange={e => setPCategory(e.target.value)}>
                  <option>Beverage</option>
                  <option>Food</option>
                </select>
              </div>

              {pCategory === 'Beverage' && (
                <div className="pp-field">
                  <label className="pp-label">Beverage Type</label>
                  <select className="pp-select" value={bevType} onChange={e => setBevType(e.target.value)}>
                    <option>Coffee</option>
                    <option>Milktea</option>
                    <option>Soda</option>
                    <option>Mocktail</option>
                  </select>
                </div>
              )}

              <div className="pp-field">
                <label className="pp-label">Temperature</label>
                <div className="pp-temp-row">
                  {['Hot', 'Iced'].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`pp-temp-btn ${temperature.includes(t) ? 'pp-temp-btn--active' : ''}`}
                      onClick={() => toggleTemp(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Base price field — shown for all categories */}
              <div className="pp-field">
                <label className="pp-label">
                  Price (₱){pCategory === 'Beverage' ? ' — base / no-size price' : ''}
                </label>
                <input
                  className="pp-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                />
              </div>

              <div className="pp-field">
                <label className="pp-label">Product Image</label>
                <div className="pp-img-tabs">
                  <button
                    type="button"
                    className={`pp-img-tab ${imageTab === 'upload' ? 'pp-img-tab--active' : ''}`}
                    onClick={() => setImageTab('upload')}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className={`pp-img-tab ${imageTab === 'url' ? 'pp-img-tab--active' : ''}`}
                    onClick={() => setImageTab('url')}
                  >
                    Paste URL
                  </button>
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFile} />
                {imageTab === 'upload' ? (
                  <div className="pp-dropzone" onClick={() => fileInputRef.current?.click()}>
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'8px'}} />
                      : <><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b0a89e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Click to upload or drag &amp; drop</span></>
                    }
                  </div>
                ) : (
                  <input className="pp-input" type="url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                )}
              </div>

              <div className="pp-checkbox-row">
                <input
                  type="checkbox"
                  id="pp-avail"
                  checked={available}
                  onChange={e => setAvailable(e.target.checked)}
                />
                <label htmlFor="pp-avail">Mark as available for ordering</label>
              </div>
            </div>
          )}

          {/* ── TAB: Variants ── */}
          {activeTab === 'variants' && (
            <div className="pp-body">
              <div className="pp-field">
                <label className="pp-label">Size Type</label>
                <select
                  className="pp-select"
                  value={sizeType}
                  onChange={e => {
                    const t = e.target.value;
                    setSizeType(t);
                    setVariants([{ size: t === 'S/M/L' ? 'Small' : '12oz', price: '120.00' }]);
                  }}
                >
                  <option>Oz</option>
                  <option>S/M/L</option>
                </select>
              </div>

              <div className="pp-variants-hdr">
                <label className="pp-label">Sizes in {sizeType === 'S/M/L' ? 's/m/l' : 'oz'}</label>
                <button type="button" className="pp-add-link" onClick={addVariant}>+ Add Size</button>
              </div>

              {variants.map((v, i) => (
                <div key={i} className="pp-variant-row">
                  <div className="pp-price-wrap">
                    <span className="pp-price-prefix">Size</span>
                    <select
                      className="pp-select pp-select--sm"
                      value={v.size}
                      onChange={e => updateVariant(i, 'size', e.target.value)}
                    >
                      {getSizeOptions(sizeType).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="pp-price-wrap">
                    <span className="pp-price-prefix">Price (₱)</span>
                    <input
                      className="pp-input pp-input--price"
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={e => updateVariant(i, 'price', e.target.value)}
                    />
                  </div>
                  <div className="pp-remove-wrap">
                    <button
                      type="button"
                      className="pp-remove-btn"
                      onClick={() => removeVariant(i)}
                      disabled={variants.length <= 1}
                    >✕</button>
                  </div>
                </div>
              ))}

              <div className="pp-checkbox-row" style={{ marginTop: '12px' }}>
                <input
                  type="checkbox"
                  id="pp-avail-v"
                  checked={available}
                  onChange={e => setAvailable(e.target.checked)}
                />
                <label htmlFor="pp-avail-v">Mark as available for ordering</label>
              </div>
            </div>
          )}

          {/* ── TAB: Recipe ── */}
          {activeTab === 'recipe' && (
            <div className="pp-body">
              <div className="pp-recipe-info">
                Select ingredients from inventory and specify quantities used per serving.
              </div>

              <div className="pp-variants-hdr">
                <span />
                <button type="button" className="pp-add-link" onClick={addIngredient}>+ Add Ingredient</button>
              </div>

              {ingredients.map((ing, i) => (
                <div key={i} className="pp-variant-row pp-variant-row--recipe">
                  <div className="pp-ing-col">
                    <span className="pp-col-label">Ingredient</span>
                    <select
                      className="pp-select pp-select--sm"
                      value={ing.ingredient}
                      onChange={e => updateIngredient(i, 'ingredient', e.target.value)}
                    >
                      {ingredientsList.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="pp-ing-col">
                    <span className="pp-col-label">Quantity Used</span>
                    <select
                      className="pp-select pp-select--sm"
                      value={ing.qty}
                      onChange={e => updateIngredient(i, 'qty', e.target.value)}
                    >
                      {QTY_UNITS.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="pp-remove-btn"
                    style={{ alignSelf: 'flex-end' }}
                    onClick={() => removeIngredient(i)}
                    disabled={ingredients.length <= 1}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="pp-footer">
            <button type="button" className="pp-cancel" onClick={onClose}>Cancel</button>
            <button type="button" className="pp-submit" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add'}</button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ProductsSection() {
  const { products, addProduct, updateProduct, deleteProduct, inventory } = useStore();
  const ingredientsList = inventory.length
    ? inventory.map(i => i.name)
    : INGREDIENTS_FALLBACK;
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('All');
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [panelMode,   setPanelMode]   = useState('add');
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saveToast,   setSaveToast]   = useState(false);

  const filtered  = products.filter(p =>
    (filter === 'All' || p.category === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const available = products.filter(p => p.status === 'available').length;
  const foodCount = products.filter(p => p.category === 'Sides').length;
  const beverages = products.filter(p => p.category !== 'Sides').length;

  function openAdd()        { setPanelMode('add');  setEditProduct(null); setPanelOpen(true); setConfirmDeleteId(null); }
  function openEdit(prod)   { setPanelMode('edit'); setEditProduct(prod); setPanelOpen(true); setConfirmDeleteId(null); }
  function handleDelete(id) {
    const product = products.find(p => p.id === id);
    if (product) updateProduct({ ...product, status: 'unavailable' });
    setConfirmDeleteId(null);
  }
  function handleSave(data) {
    if (panelMode === 'edit') updateProduct(data);
    else addProduct(data);
    setPanelOpen(false);
    setSaveToast(true);
  }

  return (
    <div className="adm-content adm-content--products">
      {/* Save success toast */}
      {saveToast && createPortal(
        <div className="emp-save-toast" onAnimationEnd={() => setSaveToast(false)}>
          <div className="emp-save-toast__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="emp-save-toast__text">
            <span className="emp-save-toast__title">Product Saved!</span>
            <span className="emp-save-toast__sub">Product has been {panelMode === 'edit' ? 'updated' : 'added'} successfully.</span>
          </div>
          <button className="emp-save-toast__close" onClick={() => setSaveToast(false)}>×</button>
        </div>,
        document.body
      )}

      {/* Delete confirm modal */}
      {confirmDeleteId && (() => {
        const p = products.find(x => x.id === confirmDeleteId);
        return p ? (
          <DeleteConfirmModal
            name={p.name}
            title="Mark as Unavailable?"
            message={<>This will hide <strong>&ldquo;{p.name}&rdquo;</strong> from the menu. You can re-enable it anytime by editing the product.</>}
            confirmLabel="Yes, mark unavailable"
            onConfirm={() => handleDelete(confirmDeleteId)}
            onCancel={() => setConfirmDeleteId(null)}
          />
        ) : null;
      })()}

      <div className="adm-page-header">
        <h1 className="adm-page-title">Products</h1>
        <button className="adm-btn-add" onClick={openAdd}>{Icon.plus} Add a product</button>
      </div>

      <div className="prod-cat-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`prod-cat-tab ${filter === cat.id ? 'prod-cat-tab--active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            <div className="prod-cat-tab__img"><img src={cat.icon} alt={cat.label} /></div>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="prod-list-hdr">
        <h2 className="prod-list-heading">{filter}</h2>
        <div className="adm-search prod-search">
          {Icon.search}
          <input type="text" placeholder="Enter Product Name" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="adm-count-pills">
        <span className="adm-pill">{products.length} total</span>
        <span className="adm-pill adm-pill--green">{available} available</span>
        <span className="adm-pill">{foodCount} food</span>
        <span className="adm-pill">{beverages} beverages</span>
      </div>

      <div className="prod-list">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onEdit={openEdit} onDelete={(id) => setConfirmDeleteId(id)} />
        ))}
        {filtered.length === 0 && <p className="adm-muted" style={{padding:'24px 0'}}>No products found.</p>}
      </div>

      <ProductPanel
        open={panelOpen}
        mode={panelMode}
        product={editProduct}
        onClose={() => setPanelOpen(false)}
        onSave={handleSave}
        ingredientsList={ingredientsList}
      />
    </div>
  );
}


/* ══════════════════════════════════════════════════
   SECTION: INVENTORY
   ══════════════════════════════════════════════════ */
function InventorySection() {
  const { inventory, addInventory, updateInventory, deleteInventory, restockInventory } = useStore();
  const [search, setSearch] = useState('');
  const [restockId, setRestockId] = useState(null);
  const [restockAmt, setRestockAmt] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', qty: '', unit: 'g', threshold: '' });

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const inStock  = inventory.filter(i => i.status === 'In Stock').length;
  const low      = inventory.filter(i => i.status === 'Low Stock').length;
  const out      = inventory.filter(i => i.status === 'Out of Stock').length;

  function handleRestock(id) {
    const amt = parseInt(restockAmt, 10);
    if (amt > 0) { restockInventory(id, amt); setRestockId(null); setRestockAmt(''); }
  }
  function handleDelete(id) {
    deleteInventory(id);
    setConfirmDeleteId(null);
  }
  function handleAddItem() {
    if (!newItem.name.trim()) return;
    const qty = parseInt(newItem.qty, 10) || 0;
    const threshold = parseInt(newItem.threshold, 10) || 0;
    let status = 'In Stock';
    if (qty <= 0) status = 'Out of Stock';
    else if (qty <= threshold) status = 'Low Stock';
    addInventory({ ...newItem, qty, threshold, status });
    setNewItem({ name: '', qty: '', unit: 'g', threshold: '' });
    setShowAdd(false);
  }

  return (
    <div className="adm-content">
      {/* Delete confirm modal */}
      {confirmDeleteId && (() => {
        const item = inventory.find(x => x.id === confirmDeleteId);
        return item ? (
          <DeleteConfirmModal
            name={item.name}
            onConfirm={() => handleDelete(confirmDeleteId)}
            onCancel={() => setConfirmDeleteId(null)}
          />
        ) : null;
      })()}

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Inventory</h1>
          <p className="adm-page-desc">Track ingredients and stock levels.</p>
        </div>
        <button className="adm-btn-add" onClick={() => setShowAdd(true)}>{Icon.plus} Add ingredient</button>
      </div>

      {showAdd && (
        <div className="adm-card" style={{marginBottom:'16px'}}>
          <div className="adm-card-hdr"><h3>Add New Item</h3></div>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'flex-end',padding:'0 0 8px'}}>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Name</label>
              <input className="pp-input" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Item name" style={{width:'180px'}} /></div>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Qty</label>
              <input className="pp-input" type="number" min="0" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: Math.max(0, e.target.value)})} placeholder="0" style={{width:'80px'}} /></div>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Unit</label>
              <select className="pp-select" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} style={{width:'80px'}}><option>g</option><option>ml</option><option>pcs</option><option>kg</option></select></div>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Threshold</label>
              <input className="pp-input" type="number" min="0" value={newItem.threshold} onChange={e => setNewItem({...newItem, threshold: Math.max(0, e.target.value)})} placeholder="0" style={{width:'80px'}} /></div>
            <button className="pp-submit" style={{height:'36px'}} onClick={handleAddItem}>Add</button>
            <button className="pp-cancel" style={{height:'36px'}} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="adm-filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Enter Item Name" />
      </div>

      <div className="adm-count-pills">
        <span className="adm-pill">{inventory.length} total</span>
        <span className="adm-pill adm-pill--green">{inStock} in stock</span>
        <span className="adm-pill adm-pill--yellow">{low} low stock</span>
        <span className="adm-pill adm-pill--red">{out} out of stock</span>
      </div>

      <div className="adm-card adm-card--flush">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Item Name</th><th>Stock Quantity</th><th>Threshold</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => (
              <React.Fragment key={i.id}>
                <tr>
                  <td className="adm-bold">{i.name}</td>
                  <td>{i.qty} {i.unit}</td>
                  <td className="adm-muted">{i.threshold} {i.unit}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td>
                    <div className="adm-actions">
                      <button
                        className={`adm-action-btn ${restockId === i.id ? 'adm-action-btn--brown' : 'adm-action-btn--green'}`}
                        title={restockId === i.id ? 'Close restock' : 'Restock'}
                        onClick={() => {
                          if (restockId === i.id) { setRestockId(null); setRestockAmt(''); }
                          else { setRestockId(i.id); setRestockAmt(''); setConfirmDeleteId(null); }
                        }}
                      >
                        {restockId === i.id
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        }
                      </button>
                      <button className="adm-action-btn adm-action-btn--red" title="Delete" onClick={() => { setConfirmDeleteId(i.id); setRestockId(null); }}>{Icon.trash}</button>
                    </div>
                  </td>
                </tr>

                {/* ── Restock inline panel ── */}
                {restockId === i.id && (
                  <tr key={`${i.id}-restock`} className="inv-restock-row">
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div className="inv-restock-card">
                        <div className="inv-restock-info">
                          <span className="inv-restock-name">{i.name}</span>
                          <span className="inv-restock-current">Current stock: <strong>{i.qty} {i.unit}</strong></span>
                        </div>
                        <div className="inv-restock-form">
                          <label className="inv-restock-label">Add quantity ({i.unit})</label>
                          <div className="inv-restock-controls">
                            <button
                              className="inv-restock-step"
                              onClick={() => setRestockAmt(a => String(Math.max(0, (parseInt(a,10)||0) - 1)))}
                            >−</button>
                            <input
                              type="number"
                              min="0"
                              className="inv-restock-input"
                              value={restockAmt}
                              onChange={e => setRestockAmt(String(Math.max(0, parseInt(e.target.value,10) || 0)))}
                              placeholder="0"
                              autoFocus
                            />
                            <button
                              className="inv-restock-step"
                              onClick={() => setRestockAmt(a => String((parseInt(a,10)||0) + 1))}
                            >+</button>
                          </div>
                        </div>
                        <div className="inv-restock-btns">
                          <button className="inv-restock-cancel" onClick={() => { setRestockId(null); setRestockAmt(''); }}>Cancel</button>
                          <button className="inv-restock-confirm" onClick={() => handleRestock(i.id)} disabled={!restockAmt || parseInt(restockAmt,10) <= 0}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Confirm Restock
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: REWARDS  (with two tabs + right panel)
   ══════════════════════════════════════════════════ */
function RewardsSection() {
  const { rewards, addReward, updateReward, deleteReward } = useStore();
  const [activeTab,   setActiveTab]   = useState('available');
  const [confirmId,   setConfirmId]   = useState(null);
  const [searchCards, setSearchCards] = useState('');

  /* right-panel state (shared for both tabs) */
  const [rightPanel,   setRightPanel]   = useState(null);
  // 'rewardDetail' | 'maxPoints' | 'addStamps' | 'updateStep1' | 'updateStep2'

  /* Available Rewards panel state */
  const [editingReward, setEditingReward] = useState(null);
  const [rewardForm,    setRewardForm]    = useState({ name: '', type: 'Discount (%)', discountAmt: '', stamps: 10 });
  const [maxPoints,     setMaxPoints]     = useState(30);
  const [maxPointsDraft,setMaxPointsDraft]= useState('30');

  /* Stamp Cards panel state */
  const [panelRow,     setPanelRow]     = useState(null);
  const [addStampsAmt, setAddStampsAmt] = useState('');
  const [updateForm,   setUpdateForm]   = useState({ custName: '', custType: 'With Registered Jazsam Account', custId: '', cardNo: '' });

  const REWARD_TYPES = ['Discount (%)', 'Discount (₱)', 'Free Item', 'Birthday reward'];
  const CUST_TYPES   = ['With Registered Jazsam Account', 'Walk-in / No Jazsam Account'];

  const stampsRequired = maxPoints;

  const [dbCustomers, setDbCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost/salespresso-api/customers.php')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDbCustomers(data); })
      .catch(() => {});
  }, []);

  const cardRows = dbCustomers
    .filter(u => searchCards === '' || u.name.toLowerCase().includes(searchCards.toLowerCase()))
    .map((u, idx) => {
      const stamps = u.points || 0;
      const pct    = Math.min(100, Math.round((stamps / stampsRequired) * 100));
      const earned = stamps >= stampsRequired;
      const rewardable = stamps >= stampsRequired;
      const allRedeemed = stamps >= stampsRequired * rewards.length;
      const cardNo = `Card# ${String(1000 + idx + 1 + 22).replace(/^[0-9]{5,}/,'').slice(-4) || String(idx + 1023)}`;
      return { ...u, stamps, pct, earned, rewardable, allRedeemed, cardNo };
    });

  function saveStamps(userId, newStamps) {
    // Optimistic local update
    setDbCustomers(cs => cs.map(c => c.id === userId ? { ...c, points: newStamps } : c));
    // Also update the customer session cache if this is the logged-in user
    try {
      const session = JSON.parse(localStorage.getItem('jazsam_user') || 'null');
      if (session && session.id === userId) {
        localStorage.setItem('jazsam_user', JSON.stringify({ ...session, points: newStamps }));
      }
    } catch {}
    // Persist to DB
    fetch('http://localhost/salespresso-api/customers.php', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: userId, points: newStamps }),
    }).catch(() => {});
  }

  function handleAddStampsConfirm() {
    if (!panelRow) return;
    const toAdd = Math.max(0, parseInt(addStampsAmt, 10) || 0);
    saveStamps(panelRow.id, panelRow.stamps + toAdd);
    closePanel();
  }

  function handleResetStamps(row) {
    saveStamps(row.id, 0);
    forceRerender(n => n + 1);
  }

  function openAddStamps(row) {
    setPanelRow(row);
    setAddStampsAmt('');
    setRightPanel('addStamps');
  }

  function openUpdate(row) {
    setPanelRow(row);
    setUpdateForm({ custName: row.name || '', custType: 'With Registered Jazsam Account', custId: '', cardNo: '' });
    setRightPanel('updateStep1');
  }

  function closePanel() {
    setRightPanel(null);
    setPanelRow(null);
  }

  function openAddReward() {
    setEditingReward(null);
    setRewardForm({ name: '', type: 'Discount (%)', discountAmt: '', stamps: 10 });
    setRightPanel('rewardDetail');
  }

  function openEditReward(r) {
    setEditingReward(r);
    setRewardForm({ name: r.name, type: r.type || 'Discount (%)', discountAmt: r.value || '', stamps: r.stamps || 10 });
    setRightPanel('rewardDetail');
  }

  function handleSaveReward() {
    if (!rewardForm.name.trim()) return;
    const payload = { name: rewardForm.name, type: rewardForm.type, value: rewardForm.discountAmt, stamps: Number(rewardForm.stamps) || 10 };
    if (editingReward) { updateReward({ ...editingReward, ...payload }); }
    else               { addReward(payload); }
    closePanel();
  }

  function openMaxPoints() {
    setMaxPointsDraft(String(maxPoints));
    setRightPanel('maxPoints');
  }

  function handleSaveMaxPoints() {
    const v = parseInt(maxPointsDraft, 10);
    if (v > 0) setMaxPoints(v);
    closePanel();
  }

  function getTypeColor(type) {
    if (!type) return '#7a7068';
    if (type.includes('%'))      return '#0891b2';
    if (type.includes('₱'))     return '#d97706';
    if (type.includes('Free'))   return '#16a34a';
    if (type.includes('Birthday')) return '#9333ea';
    return '#7a7068';
  }

  function getAmountLabel(type) {
    if (type === 'Discount (%)')  return { label: 'Discount amount', suffix: '%' };
    if (type === 'Discount (₱)') return { label: 'Discount amount', suffix: '₱' };
    if (type === 'Free Item')     return { label: 'Item description', suffix: '' };
    return { label: 'Reward value', suffix: '' };
  }

  function rewardStatus(row) {
    if (row.allRedeemed) return { label: 'All Rewards Redeemed', color: '#22c55e' };
    if (row.rewardable)  return { label: '1 Reward/s Redeemable', color: '#22c55e' };
    return { label: 'Collecting', color: '#7a7068' };
  }

  const totalRewards = cardRows.length * rewards.length;

  return (
    <div className="adm-content" style={{ position: 'relative' }}>
      {/* Delete confirm modal */}
      {confirmId && (() => {
        const r = rewards.find(x => x.id === confirmId);
        return r ? (
          <DeleteConfirmModal
            name={r.name}
            onConfirm={() => { deleteReward(confirmId); setConfirmId(null); }}
            onCancel={() => setConfirmId(null)}
          />
        ) : null;
      })()}

      {/* ── Header ── */}
      <div className="rwd-header">
        <h1 className="adm-page-title">Loyalty Card Rewards</h1>
        <div className="rwd-header__right">
          <div className="adm-search">
            {Icon.search}
            <input
              type="text"
              placeholder="Search reward"
              value={searchCards}
              onChange={e => setSearchCards(e.target.value)}
            />
          </div>
          <button className="emp-btn-add" onClick={openAddReward} title="Add reward">{Icon.plus}</button>
          <button className="emp-btn-sort" title="Filter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="adm-orders-tabs">
        <button
          className={`adm-orders-tab${activeTab === 'available' ? ' active' : ''}`}
          onClick={() => { setActiveTab('available'); closePanel(); }}
        >
          Available Rewards
        </button>
        <button
          className={`adm-orders-tab${activeTab === 'cards' ? ' active' : ''}`}
          onClick={() => { setActiveTab('cards'); closePanel(); }}
        >
          Customer Stamp Cards
        </button>
      </div>
      <div className="adm-orders-tab-line" />

      {/* ── Available Rewards tab ── */}
      {activeTab === 'available' && (
        <>
          {/* Sliding panels (fixed overlay, same style as Edit Product) */}
          {(rightPanel === 'rewardDetail' || rightPanel === 'maxPoints') && (
            <div className="pp-backdrop" onClick={closePanel} />
          )}

          {/* Reward Details panel */}
          <aside className={`pp-panel ${rightPanel === 'rewardDetail' ? 'pp-panel--open' : ''}`}>
            <div className="pp-inner">
              <div className="pp-header">
                <h2 className="pp-title">{editingReward ? 'Edit Reward' : 'Add Reward'}</h2>
              </div>
              <div className="pp-body">
                <div className="pp-field">
                  <label className="pp-label">Reward Name</label>
                  <input
                    className="pp-input"
                    placeholder="e.g. Loyalty Card Reward 1"
                    value={rewardForm.name}
                    onChange={e => setRewardForm({ ...rewardForm, name: e.target.value })}
                  />
                </div>
                <div className="pp-field">
                  <label className="pp-label">Loyalty Reward Type</label>
                  <select
                    className="pp-select"
                    value={rewardForm.type}
                    onChange={e => setRewardForm({ ...rewardForm, type: e.target.value })}
                  >
                    {REWARD_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {rewardForm.type !== 'Birthday reward' && (
                  <div className="pp-field">
                    <label className="pp-label">{getAmountLabel(rewardForm.type).label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type={rewardForm.type === 'Free Item' ? 'text' : 'number'}
                        className="pp-input"
                        style={{ flex: 1 }}
                        value={rewardForm.discountAmt}
                        onChange={e => setRewardForm({ ...rewardForm, discountAmt: e.target.value })}
                        placeholder={rewardForm.type === 'Free Item' ? 'e.g. Small Drink' : '0'}
                      />
                      {getAmountLabel(rewardForm.type).suffix && (
                        <span style={{ fontSize: '0.85rem', color: '#7a7068', fontWeight: 600, flexShrink: 0 }}>
                          {getAmountLabel(rewardForm.type).suffix}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="pp-field">
                  <label className="pp-label">Stamps Required</label>
                  <input
                    type="number"
                    min="1"
                    className="pp-input"
                    value={rewardForm.stamps}
                    onChange={e => setRewardForm({ ...rewardForm, stamps: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  />
                </div>
              </div>
              <div className="pp-footer">
                <button className="pp-cancel" onClick={closePanel}>Cancel</button>
                <button className="pp-submit" onClick={handleSaveReward}>
                  {editingReward ? 'Save Changes' : 'Add Reward'}
                </button>
              </div>
            </div>
          </aside>

          {/* Set Maximum Card Points panel */}
          <aside className={`pp-panel ${rightPanel === 'maxPoints' ? 'pp-panel--open' : ''}`}>
            <div className="pp-inner">
              <div className="pp-header">
                <h2 className="pp-title">Set Maximum Card Points</h2>
              </div>
              <div className="pp-body">
                <p style={{ fontSize: '0.82rem', color: '#7a7068', lineHeight: 1.65, margin: 0 }}>
                  Set a maximum number of points for the stamp card. Once a customer reaches this limit, the card can no longer collect stamps or be used. To continue receiving rewards, the customer must obtain a new card.
                </p>
                <div className="pp-field">
                  <label className="pp-label">Max Points per Card</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      min="1"
                      className="pp-input"
                      style={{ flex: 1 }}
                      value={maxPointsDraft}
                      onChange={e => setMaxPointsDraft(e.target.value)}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#7a7068', fontWeight: 600, flexShrink: 0 }}>points</span>
                  </div>
                </div>
              </div>
              <div className="pp-footer">
                <button className="pp-cancel" onClick={closePanel}>Cancel</button>
                <button className="pp-submit" onClick={handleSaveMaxPoints}>Save</button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="rwd-maxpts-row">
            <div className="rwd-maxpts-left">
              <span className="rwd-maxpts-label">Max Points per Card :</span>
              <span className="rwd-maxpts-value">{maxPoints}</span>
              <button className="rwd-maxpts-edit" onClick={openMaxPoints} title="Edit max points">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
            <span className="rwd-avail-count">{rewards.length} rewards available</span>
          </div>

          <div className="adm-card adm-card--flush">
            <table className="adm-table rwd-avail-table">
              <thead>
                <tr>
                  <th>Reward name</th>
                  <th>Value</th>
                  <th>Requirement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rewards.length === 0 && (
                  <tr><td colSpan="4" className="adm-muted" style={{ textAlign: 'center', padding: '32px' }}>No rewards yet. Click + to add one.</td></tr>
                )}
                {rewards.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="rwd-name-cell">
                        <strong>{r.name}</strong>
                        <span className="rwd-type-badge" style={{ color: getTypeColor(r.type) }}>{r.type}</span>
                      </div>
                    </td>
                    <td>{r.value}</td>
                    <td>{r.stamps} stamps</td>
                    <td>
                      <div className="rwd-avail-actions">
                        <button className="rwd-avail-btn rwd-avail-btn--del" onClick={() => setConfirmId(r.id)} title="Delete">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                        </button>
                        <button className="rwd-avail-btn rwd-avail-btn--edit" onClick={() => openEditReward(r)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Customer Stamp Cards tab ── */}
      {activeTab === 'cards' && (
        <div className="rwd-cards-layout">
          <div className="rwd-cards-main">
            <div className="rwd-cards-meta">
              <span className="adm-muted" style={{ fontSize: '0.82rem' }}>{totalRewards} rewards available</span>
            </div>
            <div className="adm-card adm-card--flush">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Card #</th>
                    <th>Stamps Collected</th>
                    <th>Reward Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cardRows.length === 0 && (
                    <tr><td colSpan="5" className="adm-muted" style={{ textAlign: 'center', padding: '32px' }}>No registered customers yet.</td></tr>
                  )}
                  {cardRows.map(row => {
                    const rs = rewardStatus(row);
                    return (
                      <tr key={row.id}>
                        <td className="adm-bold">{row.name}</td>
                        <td className="adm-muted">{row.cardNo}</td>
                        <td>
                          <div className="rwd-stamp-cell">
                            <span className="rwd-stamp-count">{row.stamps}</span>
                            <div className="rwd-progress-bar">
                              <div
                                className="rwd-progress-fill"
                                style={{
                                  width: `${row.pct}%`,
                                  background: row.allRedeemed ? '#22c55e' : row.pct >= 50 ? '#f59e0b' : '#d4c5f0',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: rs.color, fontWeight: 700, fontSize: '0.82rem' }}>{rs.label}</span>
                        </td>
                        <td>
                          <div className="rwd-action-btns">
                            <button className="rwd-btn rwd-btn--stamp" onClick={() => openAddStamps(row)}>
                              + Stamp
                            </button>
                            <button className="rwd-btn rwd-btn--update" onClick={() => openUpdate(row)}>
                              {Icon.edit} Update
                            </button>
                            <button className="rwd-btn rwd-btn--reset" onClick={() => handleResetStamps(row)}>
                              Reset
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Right panel ── */}
          {rightPanel && (
            <div className="rwd-right-panel">
              {/* Add Stamps panel */}
              {rightPanel === 'addStamps' && panelRow && (
                <>
                  <h3 className="rwd-panel-title">Add Stamps</h3>
                  <div className="rwd-panel-divider" />
                  <div className="rwd-panel-info-row">
                    <span className="rwd-panel-label">Customer :</span>
                    <span className="rwd-panel-value">{panelRow.name}</span>
                  </div>
                  <div className="rwd-panel-info-row">
                    <span className="rwd-panel-label">Card # :</span>
                    <span className="rwd-panel-value">{panelRow.cardNo}</span>
                  </div>
                  <div className="rwd-stamp-counter-box">
                    <div className="rwd-stamp-counter-num">
                      {panelRow.stamps} / {stampsRequired}
                    </div>
                    <div className="rwd-stamp-counter-sub">
                      stamps collected &nbsp;•&nbsp; {Math.max(0, stampsRequired - panelRow.stamps)} remaining to full card
                    </div>
                  </div>
                  <label className="rwd-panel-field-label">Number of Stamps to Add</label>
                  <div className="rwd-panel-input-row">
                    <input
                      type="number"
                      min="1"
                      className="rwd-panel-input"
                      value={addStampsAmt}
                      onChange={e => setAddStampsAmt(e.target.value)}
                      placeholder="0"
                      autoFocus
                    />
                    <span className="rwd-panel-input-suffix">stamps</span>
                  </div>
                  <div className="rwd-panel-footer">
                    <button className="rwd-panel-btn rwd-panel-btn--delete" onClick={closePanel} title="Cancel">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                    <button className="rwd-panel-btn rwd-panel-btn--back" onClick={closePanel} title="Back">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button className="rwd-panel-btn rwd-panel-btn--confirm" onClick={handleAddStampsConfirm} title="Confirm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                  </div>
                </>
              )}

              {/* Update step 1 — Reward details */}
              {rightPanel === 'updateStep1' && (
                <>
                  <h3 className="rwd-panel-title">Reward details</h3>
                  <div className="rwd-panel-divider" />
                  <div className="rwd-panel-form">
                    <label className="rwd-panel-field-label">Customer Name</label>
                    <input
                      className="rwd-panel-input rwd-panel-input--full"
                      value={updateForm.custName}
                      onChange={e => setUpdateForm({ ...updateForm, custName: e.target.value })}
                    />
                    <label className="rwd-panel-field-label" style={{ marginTop: 16 }}>Customer type</label>
                    <select
                      className="rwd-panel-select"
                      value={updateForm.custType}
                      onChange={e => setUpdateForm({ ...updateForm, custType: e.target.value })}
                    >
                      {CUST_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="rwd-panel-footer">
                    <button className="rwd-panel-btn rwd-panel-btn--delete" onClick={closePanel} title="Cancel">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                    <button className="rwd-panel-btn rwd-panel-btn--back" onClick={closePanel} title="Back">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button className="rwd-panel-btn rwd-panel-btn--confirm" onClick={() => setRightPanel('updateStep2')} title="Next">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                  </div>
                </>
              )}

              {/* Update step 2 — Customer card details */}
              {rightPanel === 'updateStep2' && (
                <>
                  <h3 className="rwd-panel-title">Customer card details</h3>
                  <div className="rwd-panel-divider" />
                  <div className="rwd-panel-form">
                    <label className="rwd-panel-field-label">Customer Name</label>
                    <input
                      className="rwd-panel-input rwd-panel-input--full"
                      value={updateForm.custName}
                      onChange={e => setUpdateForm({ ...updateForm, custName: e.target.value })}
                    />
                    <label className="rwd-panel-field-label" style={{ marginTop: 16 }}>Customer type</label>
                    <select
                      className="rwd-panel-select"
                      value={updateForm.custType}
                      onChange={e => setUpdateForm({ ...updateForm, custType: e.target.value })}
                    >
                      {CUST_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {updateForm.custType === 'With Registered Jazsam Account' && (
                      <>
                        <label className="rwd-panel-field-label" style={{ marginTop: 16 }}>Enter Customer ID</label>
                        <input
                          className="rwd-panel-input rwd-panel-input--full"
                          value={updateForm.custId}
                          onChange={e => setUpdateForm({ ...updateForm, custId: e.target.value })}
                          placeholder="e.g. 10012"
                        />
                      </>
                    )}
                    <label className="rwd-panel-field-label" style={{ marginTop: 16 }}>Enter Stamp Card No.</label>
                    <input
                      className="rwd-panel-input rwd-panel-input--full"
                      value={updateForm.cardNo}
                      onChange={e => setUpdateForm({ ...updateForm, cardNo: e.target.value })}
                      placeholder="e.g. 1025"
                    />
                  </div>
                  <div className="rwd-panel-footer">
                    <button className="rwd-panel-btn rwd-panel-btn--delete" onClick={closePanel} title="Cancel">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                    <button className="rwd-panel-btn rwd-panel-btn--back" onClick={() => setRightPanel('updateStep1')} title="Back">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button className="rwd-panel-btn rwd-panel-btn--confirm" onClick={closePanel} title="Save">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: ORDERS
   ══════════════════════════════════════════════════ */
function OrdersSection() {
  const { orders, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState('incoming');
  const [search, setSearch] = useState('');
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const adminSession = JSON.parse(localStorage.getItem('jazsam_admin') || '{}');
  const adminName = adminSession.name || 'Admin';

  function cycleStatus(order) {
    const flow = { 'Pending': 'Preparing', 'Preparing': 'Completed' };
    const next = flow[order.status];
    if (next) { updateOrderStatus(order.id, next); setConfirmCancelId(null); }
  }
  function cancelOrder(id) {
    updateOrderStatus(id, 'Cancelled');
    setConfirmCancelId(null);
  }

  const incomingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing');

  const historyOrders = orders.filter(o =>
    (o.status === 'Completed' || o.status === 'Cancelled') &&
    ((o.id || '').toLowerCase().includes(search.toLowerCase()) ||
     (o.customer || o.userId || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="adm-content">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Orders</h1>
        </div>
      </div>

      {/* ── Main tab bar ── */}
      <div className="adm-orders-tabs">
        <button
          className={`adm-orders-tab${activeTab === 'incoming' ? ' active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming orders
        </button>
        <button
          className={`adm-orders-tab${activeTab === 'history' ? ' active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Order history
        </button>
      </div>
      <div className="adm-orders-tab-line" />

      {/* ── Incoming Orders — card grid ── */}
      {activeTab === 'incoming' && (
        incomingOrders.length === 0 ? (
          <div className="adm-empty-state">No incoming orders at the moment.</div>
        ) : (
          <div className="adm-order-cards">
            {incomingOrders.map(o => {
              const parts = (o.date || '').split('·');
              const datePart = parts[0]?.trim() || '';
              const timePart = parts[1]?.trim() || '';
              const orderId = (o.id || '').replace(/^#/, 'ORD-');

              return (
                <div key={o.id} className="adm-order-card">
                  <div className="adm-order-card__header">
                    <div className="adm-order-card__header-row1">
                      <span className="adm-order-card__time">{timePart}</span>
                      <span className="adm-order-card__id-top">{orderId}</span>
                    </div>
                    <div className="adm-order-card__header-row2">
                      <span className="adm-order-card__date">{datePart}</span>
                      <span className="adm-order-card__id-sub">{orderId}</span>
                    </div>
                  </div>

                  <div className="adm-order-card__body">
                    {(o.items || []).map((item, idx) => {
                      const match = item.match(/^(\d+)x\s+(.+)$/);
                      const qty  = match ? match[1] : '';
                      const name = match ? match[2] : item;
                      const addons = (o.addons && o.addons[idx]) ? o.addons[idx] : [];

                      return (
                        <div key={idx} className="adm-order-card__item-wrap">
                          {idx > 0 && <div className="adm-order-card__divider" />}
                          <div className="adm-order-card__item">
                            <span className="adm-order-card__item-qty">{qty}x</span>
                            <span className="adm-order-card__item-name">{name}</span>
                          </div>
                          {addons.length > 0 && (
                            <div className="adm-order-card__tags">
                              {addons.map((tag, ti) => (
                                <span key={ti} className="adm-order-card__tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="adm-order-card__footer">
                    {confirmCancelId === o.id ? (
                      <div className="adm-order-card__confirm">
                        <span>Cancel order?</span>
                        <button className="adm-action-btn adm-action-btn--red" onClick={() => cancelOrder(o.id)}>Yes</button>
                        <button className="adm-action-btn" onClick={() => setConfirmCancelId(null)}>No</button>
                      </div>
                    ) : (
                      <div className="adm-order-card__actions">
                        {(o.status === 'Pending' || o.status === 'Preparing') && (
                          <button
                            className="adm-order-card__btn adm-order-card__btn--primary"
                            onClick={() => cycleStatus(o)}
                          >
                            {o.status === 'Pending' ? 'Start Preparing' : 'Mark Completed'}
                          </button>
                        )}
                        <button
                          className="adm-order-card__btn adm-order-card__btn--cancel"
                          onClick={() => setConfirmCancelId(o.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── Order History — table ── */}
      {activeTab === 'history' && (
        <>
          <div className="adm-filters" style={{ marginBottom: '16px' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by order ID or customer" />
          </div>
          <div className="adm-card adm-card--flush">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date and Time</th>
                  <th>Status</th>
                  <th>Employee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {historyOrders.map(o => (
                  <tr key={o.id}>
                    <td className="adm-mono">{(o.id || '').replace(/^#/, 'ORD-')}</td>
                    <td>{o.customer || o.userId || 'Guest'}</td>
                    <td className="adm-bold">
                      ₱{typeof o.total === 'number'
                        ? o.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })
                        : o.total}
                    </td>
                    <td>{o.payment || 'Cash'}</td>
                    <td className="adm-muted" style={{ fontSize: '0.8rem' }}>{o.date}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{o.employee || adminName}</td>
                    <td>
                      <button className="adm-order-action-dots" title="More actions">•••</button>
                    </td>
                  </tr>
                ))}
                {historyOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="adm-muted" style={{ textAlign: 'center', padding: '24px' }}>
                      No order history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   EMPLOYEE MODAL
   ══════════════════════════════════════════════════ */
function EmployeeModal({ employee, onClose, onSave, onDelete }) {
  const { orders } = useStore();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: employee.name?.split(' ')[0] || '',
    lastName:  employee.name?.split(' ').slice(1).join(' ') || '',
    email:     employee.email || '',
    phone:     employee.phone || '',
    position:  employee.position || '',
    hireDate:  employee.hireDate || '',
  });

  const storageKey = `emp_img_${employee.id}`;
  const [profileImg, setProfileImg] = useState(
    () => localStorage.getItem(storageKey) || null
  );
  const fileInputRef = useRef(null);

  const empOrders = orders.filter(o =>
    (o.employee || '').toLowerCase() === (employee.name || '').toLowerCase()
  );

  function initials(name) {
    const parts = (name || '').trim().split(' ');
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target.result;
      setProfileImg(b64);
      localStorage.setItem(storageKey, b64);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    onSave({
      ...employee,
      name:     `${form.firstName} ${form.lastName}`.trim(),
      email:    form.email,
      phone:    form.phone,
      position: form.position,
      hireDate: form.hireDate,
    });
  }

  return createPortal(
    <div className="emp-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="emp-modal">
        {/* Left panel */}
        <div className="emp-modal__left">
          {/* Avatar with photo upload */}
          <div
            className="emp-modal__avatar emp-modal__avatar--clickable"
            onClick={() => fileInputRef.current?.click()}
            title="Change profile photo"
          >
            {profileImg
              ? <img src={profileImg} alt="Profile" className="emp-modal__avatar-img" />
              : initials(employee.name)
            }
            <div className="emp-modal__avatar-overlay">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <p className="emp-modal__emp-name">{employee.name}</p>
          <p className="emp-modal__emp-role">{employee.position}</p>
          <nav className="emp-modal__nav">
            <button
              className={`emp-modal__nav-btn${tab === 'profile' ? ' active' : ''}`}
              onClick={() => setTab('profile')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
            <button
              className={`emp-modal__nav-btn${tab === 'history' ? ' active' : ''}`}
              onClick={() => setTab('history')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Transaction History
            </button>
          </nav>
        </div>

        {/* Right panel */}
        <div className="emp-modal__right">
          {tab === 'profile' && (
            <>
              <div className="emp-modal__right-hdr">
                <h3>Personal Information</h3>
                <button className="emp-modal__close" onClick={onClose}>×</button>
              </div>
              <div className="emp-modal__form">
                <div className="emp-modal__row">
                  <div className="emp-modal__field">
                    <label>First Name</label>
                    <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                  </div>
                  <div className="emp-modal__field">
                    <label>Last Name</label>
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="emp-modal__row">
                  <div className="emp-modal__field">
                    <label>Email</label>
                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="emp-modal__field">
                    <label>Contact No.</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
                <div className="emp-modal__row">
                  <div className="emp-modal__field">
                    <label>Role</label>
                    <input value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
                  </div>
                  <div className="emp-modal__field">
                    <label>Hire Date</label>
                    <input value={form.hireDate} placeholder="MM-DD-YY" onChange={e => setForm({...form, hireDate: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="emp-modal__footer">
                <button className="emp-modal__btn--delete" onClick={() => onDelete(employee.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  Delete Profile
                </button>
                <button className="emp-modal__btn--save" onClick={handleSave}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Save Changes
                </button>
              </div>
            </>
          )}

          {tab === 'history' && (
            <>
              <div className="emp-modal__right-hdr">
                <h3>{employee.name?.split(' ')[0]}&apos;s Transaction History</h3>
                <button className="emp-modal__close" onClick={onClose}>×</button>
              </div>
              <div className="emp-modal__table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Date and Time</th>
                      <th>Total Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="adm-muted" style={{ textAlign: 'center', padding: '32px' }}>
                          No transactions found for this employee.
                        </td>
                      </tr>
                    )}
                    {empOrders.map(o => (
                      <tr key={o.id}>
                        <td className="adm-mono">{(o.id || '').replace(/^#/, 'ORD-')}</td>
                        <td className="adm-muted" style={{ fontSize: '0.8rem' }}>{o.date}</td>
                        <td className="adm-bold">
                          ₱{typeof o.total === 'number'
                            ? o.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })
                            : o.total}
                        </td>
                        <td>{o.payment || 'Cash'}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td><button className="adm-order-action-dots">•••</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════
   SECTION: EMPLOYEES
   ══════════════════════════════════════════════════ */
function EmployeesSection() {
  const { employees, updateEmployee, deleteEmployee } = useStore();
  const [search, setSearch]           = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [saveToast, setSaveToast]     = useState(false);
  const [, forceUpdate]               = useState(0);

  const activeCount   = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length;

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.empId.includes(search) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  function initials(name) {
    const parts = (name || '').trim().split(' ');
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }

  function getEmpPhoto(id) {
    try { return localStorage.getItem(`emp_img_${id}`) || null; } catch { return null; }
  }

  function handleSave(updated) {
    updateEmployee(updated);
    setSelectedEmp(null);
    setSaveToast(true);
    forceUpdate(n => n + 1);
  }

  function handleDelete(id) {
    deleteEmployee(id);
    setSelectedEmp(null);
  }

  return (
    <div className="adm-content">
      {selectedEmp && (
        <EmployeeModal
          employee={selectedEmp}
          onClose={() => setSelectedEmp(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* ── Save success toast ── */}
      {saveToast && createPortal(
        <div className="emp-save-toast" onAnimationEnd={() => setSaveToast(false)}>
          <div className="emp-save-toast__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="emp-save-toast__text">
            <span className="emp-save-toast__title">Changes Saved!</span>
            <span className="emp-save-toast__sub">Employee profile has been updated.</span>
          </div>
          <button className="emp-save-toast__close" onClick={() => setSaveToast(false)}>×</button>
        </div>,
        document.body
      )}

      {/* Header */}
      <div className="emp-section-header">
        <h1 className="adm-page-title">Employees</h1>
        <div className="emp-section-header__right">
          <div className="adm-search">
            {Icon.search}
            <input
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="emp-btn-add" title="Add employee">
            {Icon.plus}
          </button>
          <button className="emp-btn-sort" title="Sort">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="emp-stats-row">
        <span className="emp-stat-dot emp-stat-dot--active" />
        <span className="emp-stat-label">Active {activeCount}</span>
        <span className="emp-stat-dot emp-stat-dot--inactive" />
        <span className="emp-stat-label">Inactive {inactiveCount}</span>
        <span className="emp-stat-dot emp-stat-dot--total" />
        <span className="emp-stat-label">Total {employees.length}</span>
      </div>

      {/* Table */}
      <div className="adm-card adm-card--flush">
        <table className="adm-table emp-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Status</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Last Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const empPhoto = getEmpPhoto(e.id);
              return (
              <tr key={e.id}>
                <td>
                  <div className="emp-name-cell">
                    <div className="emp-avatar" style={{ overflow: 'hidden', padding: empPhoto ? 0 : undefined }}>
                      {empPhoto
                        ? <img src={empPhoto} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : initials(e.name)
                      }
                    </div>
                    <div>
                      <div className="emp-name-text">{e.name}</div>
                      <div className="emp-id-text">#{e.empId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="emp-status-cell">
                    <span className={`emp-status-dot ${e.status === 'Active' ? 'emp-status-dot--active' : 'emp-status-dot--inactive'}`} />
                    {e.status}
                  </div>
                </td>
                <td className="adm-muted">{e.email}</td>
                <td className="adm-muted">{e.phone}</td>
                <td>{e.position}</td>
                <td className="adm-muted" style={{ fontSize: '0.8rem' }}>{e.lastActive || '—'}</td>
                <td>
                  <div className="emp-action-cell">
                    <button
                      className="emp-btn-view"
                      onClick={() => setSelectedEmp(e)}
                      title="View profile"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button
                      className="emp-btn-edit"
                      onClick={() => setSelectedEmp(e)}
                      title="Edit employee"
                    >
                      {Icon.edit} Edit
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="adm-muted" style={{ textAlign: 'center', padding: '32px' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: SETTINGS
   ══════════════════════════════════════════════════ */
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      className={`stg-toggle${on ? ' stg-toggle--on' : ''}`}
      onClick={() => onChange(!on)}
      aria-checked={on}
      role="switch"
    >
      <span className="stg-toggle__thumb" />
    </button>
  );
}

function SettingsSection({ onLogout }) {
  /* Notification toggles */
  const [notifNewOrder,   setNotifNewOrder]   = useState(true);
  const [notifLowStock,   setNotifLowStock]   = useState(true);
  const [notifReward,     setNotifReward]     = useState(false);
  /* Date & time */
  const [autoTime,        setAutoTime]        = useState(true);
  const [manualDate,      setManualDate]      = useState('April 3, 2026');
  const [manualTime,      setManualTime]      = useState('10:30 PM');
  /* Reset data */
  const [resetConfirm,    setResetConfirm]    = useState(false);
  const [resetDone,       setResetDone]       = useState(false);

  async function handleResetData() {
    try {
      await fetch('http://localhost/salespresso-api/orders.php?confirm=yes', { method: 'DELETE' });
      window.dispatchEvent(new Event('jazsam_orders_updated'));
    } catch {}
    setResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  const dateOptions = MONTHS.map((m, i) => {
    const d = new Date(now.getFullYear(), i, now.getDate());
    return `${m} ${d.getDate()}, ${d.getFullYear()}`;
  });
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (const m of ['00', '30']) {
      const ampm = h < 12 ? 'AM' : 'PM';
      const h12  = h % 12 === 0 ? 12 : h % 12;
      timeOptions.push(`${h12}:${m} ${ampm}`);
    }
  }

  return (
    <div className="adm-content">
      {/* Header */}
      <div className="stg-header">
        <h1 className="adm-page-title">Settings</h1>
        <div className="stg-header__right">
          <div className="adm-search">
            {Icon.search}
            <input type="text" placeholder="Search" />
          </div>
          <button className="emp-btn-sort" title="Sort">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Settings card */}
      <div className="stg-card">

        {/* ── Notification Settings ── */}
        <h2 className="stg-section-title">Notification Settings</h2>

        <div className="stg-row">
          <div className="stg-row__info">
            <span className="stg-row__label">New Order Alert</span>
            <span className="stg-row__desc">Notify when a new order is placed</span>
          </div>
          <Toggle on={notifNewOrder} onChange={setNotifNewOrder} />
        </div>
        <div className="stg-divider" />

        <div className="stg-row">
          <div className="stg-row__info">
            <span className="stg-row__label">Low Stock Warning</span>
            <span className="stg-row__desc">Alert when inventory is low</span>
          </div>
          <Toggle on={notifLowStock} onChange={setNotifLowStock} />
        </div>
        <div className="stg-divider" />

        <div className="stg-row">
          <div className="stg-row__info">
            <span className="stg-row__label">Reward Redemption</span>
            <span className="stg-row__desc">Notify when a customer redeems</span>
          </div>
          <Toggle on={notifReward} onChange={setNotifReward} />
        </div>

        <div className="stg-section-gap" />

        {/* ── Date and Time Settings ── */}
        <h2 className="stg-section-title">Date and Time Settings</h2>

        <div className="stg-row">
          <div className="stg-row__info">
            <span className="stg-row__label">Set Data and Time Automatically</span>
            <span className="stg-row__desc">Automatically set the time base on your local timezone</span>
          </div>
          <Toggle on={autoTime} onChange={setAutoTime} />
        </div>
        <div className="stg-divider" />

        <div className="stg-row">
          <div className="stg-row__info">
            <span className="stg-row__label">Set Date and Time Manually</span>
            <span className="stg-row__desc">Manually set your time if it is inaccurate</span>
          </div>
          <div className="stg-dt-pickers">
            <select
              className="stg-picker"
              value={manualDate}
              onChange={e => setManualDate(e.target.value)}
              disabled={autoTime}
            >
              {dateOptions.map(d => <option key={d}>{d}</option>)}
            </select>
            <select
              className="stg-picker"
              value={manualTime}
              onChange={e => setManualTime(e.target.value)}
              disabled={autoTime}
            >
              {timeOptions.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="stg-section-gap" />

        {/* ── Data Management ── */}
        <h2 className="stg-section-title">Data Management</h2>

        <div className="stg-row" style={{ alignItems: 'flex-start', gap: '16px' }}>
          <div className="stg-row__info">
            <span className="stg-row__label">Reset Dashboard Data</span>
            <span className="stg-row__desc">Clear all order records and reset dashboard statistics to zero. This cannot be undone.</span>
          </div>
          <div style={{ flexShrink: 0 }}>
            {!resetConfirm ? (
              <button
                onClick={() => setResetConfirm(true)}
                style={{
                  padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #ef4444',
                  background: '#fff', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                Reset to Zero
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#7a7068', fontWeight: 600 }}>Are you sure?</span>
                <button
                  onClick={handleResetData}
                  style={{
                    padding: '7px 14px', borderRadius: '7px', border: 'none',
                    background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  style={{
                    padding: '7px 14px', borderRadius: '7px', border: '1.5px solid #e0d9d0',
                    background: '#fff', color: '#5a5450', fontWeight: 600, fontSize: '0.8rem',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            {resetDone && (
              <p style={{ marginTop: '6px', fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>
                Dashboard data has been reset.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate    = useNavigate();
  const [active, setActive] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getAdminSession();

  function handleLogout() {
    clearAdminSession();
    navigate('/admin', { replace: true });
  }

  // Close sidebar on nav (mobile)
  function handleNav(id) {
    setActive(id);
    setSidebarOpen(false);
  }

  const { orders, inventory } = useStore();
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const alertCount   = inventory.filter(i => i.status !== 'In Stock').length;

  function renderSection() {
    switch (active) {
      case 'home':      return <HomeSection />;
      case 'products':  return <ProductsSection />;
      case 'inventory': return <InventorySection />;
      case 'rewards':   return <RewardsSection />;
      case 'orders':    return <OrdersSection />;
      case 'employees': return <EmployeesSection />;
      case 'settings':  return <SettingsSection onLogout={handleLogout} />;
      default:          return <HomeSection />;
    }
  }

  return (
    <div className="adm-shell">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="adm-sidebar-brand">
          <img src="/login-icon.png" alt="JazSam" />
          <div>
            <span className="adm-sidebar-name">JazSam</span>
            <span className="adm-sidebar-role">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'orders'    && pendingCount > 0 && <span className="adm-nav-badge">{pendingCount}</span>}
              {item.id === 'inventory' && alertCount   > 0 && <span className="adm-nav-badge adm-nav-badge--warn">{alertCount}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button className="adm-sidebar-logout" onClick={handleLogout}>
          {Icon.logout}
          <span>Logout</span>
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className="adm-main">
        {/* Slim topbar — only hamburger (mobile) + avatar/link icon */}
        <header className="adm-topbar">
          <button className="adm-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          {/* spacer */}
          <span style={{ flex: 1 }} />
          <div className="adm-topbar-right">
            <button className="adm-topbar-notif" title="Go to store" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
            <div className="adm-topbar-avatar" title={session?.email}>
              {(() => {
                const img = session?.id ? localStorage.getItem(`emp_img_${session.id}`) : null;
                return img
                  ? <img src={img} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                  : (session?.name?.[0] || 'A');
              })()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="adm-main-inner">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

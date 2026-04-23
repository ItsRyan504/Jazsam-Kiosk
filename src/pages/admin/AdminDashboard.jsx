import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAdminSession, getAdminSession } from './AdminLogin';
import { useStore } from '../../context/StoreContext';
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
function DeleteConfirmModal({ name, onConfirm, onCancel }) {
  return (
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
        <h3 className="dcm-title">Delete item?</h3>
        <p className="dcm-msg">Are you sure you want to delete <strong>&ldquo;{name}&rdquo;</strong>? This action cannot be undone.</p>
        <div className="dcm-actions">
          <button className="dcm-btn dcm-btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="dcm-btn dcm-btn--delete" onClick={onConfirm}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
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
/* ── Countdown timer ── */
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

/* ── Simple SVG area chart ── */
function SalesAreaChart({ pts: rawPts }) {
  let pts = (rawPts && rawPts.length > 0 && rawPts.some(v => v > 0)) ? [...rawPts] : [0,1,2,3,4,5,6];
  // Ensure at least 2 points to avoid divide-by-zero
  while (pts.length < 2) pts.push(pts[pts.length - 1] || 0);
  const W=260, H=70, maxV=Math.max(...pts, 1);
  const coords = pts.map((v,i) => `${(i/(pts.length-1))*W},${H-(v/maxV)*H}`);
  const line   = coords.join(' L');
  const area   = `M${coords[0]} L${line} L${W},${H} L0,${H} Z`;
  const dotIdx = Math.min(Math.floor(pts.length * 0.6), pts.length - 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="home-chart-svg" preserveAspectRatio="none">
      <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7b9cef" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="#7b9cef" stopOpacity="0.02"/>
      </linearGradient></defs>
      <path d={area} fill="url(#chartGrad)"/>
      <polyline points={coords.join(' ')} fill="none" stroke="#5b7fe8" strokeWidth="2"/>
      <circle cx={coords[dotIdx].split(',')[0]} cy={coords[dotIdx].split(',')[1]} r="4" fill="#4060cf"/>
    </svg>
  );
}

/* ── Donut chart ── */
function DonutChart({ pct = 37 }) {
  const R = 52, C = 2*Math.PI*R;
  const dash = (pct/100)*C;
  return (
    <svg viewBox="0 0 130 130" className="home-donut-svg">
      <circle cx="65" cy="65" r={R} fill="none" stroke="#f0ebe4" strokeWidth="16"/>
      <circle cx="65" cy="65" r={R} fill="none" stroke="#6b4226" strokeWidth="16"
        strokeDasharray={`${dash} ${C}`} strokeLinecap="round" transform="rotate(-90 65 65)"/>
    </svg>
  );
}

function HomeSection() {
  const { orders, inventory } = useStore();
  const session = getAdminSession();
  const adminName = session?.name || 'Admin';
  const initials = adminName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

  const now   = new Date();
  const dayFmt = now.toLocaleDateString('en-PH', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
  const timeFmt = now.toLocaleTimeString('en-PH', { hour:'numeric', minute:'2-digit', hour12:true });
  const [clock, setClock] = useState(timeFmt);
  useEffect(() => { const id = setInterval(() => setClock(new Date().toLocaleTimeString('en-PH', { hour:'numeric', minute:'2-digit', hour12:true })), 30000); return () => clearInterval(id); }, []);

  /* Real stats from orders */
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalSales = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const customerCount = completedOrders.length;
  const avgMeal = customerCount > 0 ? (totalSales / customerCount).toFixed(2) : '0.00';
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  /* Stock alerts from inventory */
  const stockItems = inventory.filter(i => i.status !== 'In Stock').map(i => ({
    name: i.name,
    pct: i.threshold > 0 ? Math.min(100, Math.round((i.qty / i.threshold) * 100)) : 0,
    status: i.status === 'Out of Stock' ? 'Out of stock' : 'Low on stock',
    color: i.status === 'Out of Stock' ? '#ef4444' : '#f59e0b',
  }));
  if (stockItems.length === 0) stockItems.push({ name: 'All items', pct: 100, status: 'Sufficient stock', color: '#22c55e' });

  /* Sales goal */
  const salesGoal = 30000;
  const salesPct = Math.min(100, Math.round((totalSales / salesGoal) * 100));

  /* Sales chart from orders (last 7 orders cumulative) */
  const chartOrders = [...orders].reverse().slice(-7);
  const chartPts = chartOrders.length > 0
    ? chartOrders.map((_, i) => chartOrders.slice(0, i+1).reduce((s, o) => s + (o.total || 0), 0))
    : [0, 0, 0, 0, 0, 0, 0];

  const salesFmt = totalSales >= 1000 ? `${(totalSales/1000).toFixed(1)}k` : totalSales.toString();

  return (
    <div className="adm-content home-content">
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

      <div className="home-stats-row">
        <div className="home-stats-left">
          <div className="home-stat-card">
            <p className="home-stat-label">Customers served</p>
            <p className="home-stat-value">{customerCount}</p>
            <p className="home-stat-trend">completed orders</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Sales</p>
            <p className="home-stat-value">₱{salesFmt}</p>
            <p className="home-stat-trend">total revenue</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Average Meal Value</p>
            <p className="home-stat-value">₱{avgMeal}</p>
            <p className="home-stat-trend">per completed order</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Pending</p>
            <p className="home-stat-value">{pendingOrders}</p>
            <p className="home-stat-trend">awaiting preparation</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Cancelled</p>
            <p className="home-stat-value">{cancelledOrders}</p>
            <p className="home-stat-trend">cancelled orders</p>
          </div>
          <div className="home-stat-card">
            <p className="home-stat-label">Total Orders</p>
            <p className="home-stat-value">{orders.length}</p>
            <p className="home-stat-trend">all time</p>
          </div>
        </div>

        <div className="home-stock-alert adm-card">
          <div className="adm-card-hdr"><h3>Stock alert</h3></div>
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {stockItems.map(item => (
              <div key={item.name}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                  <span style={{fontSize:'0.875rem',fontWeight:600}}>{item.name}</span>
                  <span style={{fontSize:'0.75rem',color:item.color,fontWeight:700}}>{item.status}</span>
                </div>
                <div style={{height:'8px',borderRadius:'99px',background:'#f0ebe4',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${item.pct}%`,borderRadius:'99px',background:'#6b4226'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-charts-row">
        <div className="adm-card home-chart-card">
          <p className="home-chart-subtitle">Statistics</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <h3 style={{fontSize:'1rem',fontWeight:700}}>Sales goal</h3>
          </div>
          <p style={{fontSize:'1.8rem',fontWeight:800,color:'#1a1a1a',margin:'0 0 12px'}}>{salesPct}%</p>
          <SalesAreaChart pts={chartPts} />
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'#a0a0a0',marginTop:'8px'}}>
            <span>1 - 10 Apr</span><span>11 - 20 Apr</span><span style={{color:'#4060cf',fontWeight:700}}>21 - 30 Apr</span><span>1 - 10 Apr</span>
          </div>
          <div style={{textAlign:'center',marginTop:'8px'}}>
            <span style={{background:'#1a1a1a',color:'#fff',fontSize:'0.78rem',padding:'4px 10px',borderRadius:'6px'}}>₱{totalSales.toLocaleString()}</span>
          </div>
        </div>

        {/* Target sales */}
        <div className="adm-card home-chart-card">
          <p className="home-chart-subtitle">Statistics</p>
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:'16px'}}>Target sales</h3>
          <div style={{display:'flex',justifyContent:'center',position:'relative'}}>
            <DonutChart pct={salesPct} />
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
              <p style={{fontSize:'0.72rem',color:'#7a7472'}}>Revenue</p>
              <p style={{fontSize:'1.4rem',fontWeight:800,color:'#1a1a1a',lineHeight:1}}>₱{salesFmt}</p>
            </div>
          </div>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',marginTop:'16px',flexWrap:'wrap'}}>
            <span style={{fontSize:'0.75rem',color:'#7a7472'}}><span style={{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:'#6b4226',marginRight:'4px'}}/>Completed {completedOrders.length}</span>
            <span style={{fontSize:'0.75rem',color:'#7a7472'}}><span style={{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',border:'1.5px solid #c0b8b0',marginRight:'4px'}}/>Pending {pendingOrders}</span>
            <span style={{fontSize:'0.75rem',color:'#7a7472'}}><span style={{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:'#ef4444',marginRight:'4px'}}/>Cancelled {cancelledOrders}</span>
          </div>
        </div>

        {/* Active promos */}
        <div className="adm-card home-chart-card">
          <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:'16px'}}>Active promos</h3>
          <div style={{background:'#f4f1ee',borderRadius:'10px',padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Countdown />
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

const INGREDIENTS_LIST = ['Espresso Shot', 'Milk', 'Coffee Beans', 'Orange Juice', 'Lemon', 'Brown Sugar', 'Cream'];
const QTY_UNITS = ['10ml', '20ml', '50ml', '100ml', '200ml', '1 shot', '1 scoop', '1 pc', '1 tbsp'];
const SIZE_OPTIONS = ['4oz', '8oz', '10oz', '12oz', '16oz', '22oz', 'S', 'M', 'L', 'XL', 'XXL'];

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
function ProductPanel({ open, mode, product, onClose, onSave }) {
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
  const [variants,     setVariants]    = useState([{ size: '12oz', price: '55.00' }]);
  const [ingredients,  setIngredients] = useState([{ ingredient: 'Espresso Shot', qty: '10ml' }]);

  /* Proper reset via useEffect */
  useEffect(() => {
    if (!open) return;
    setActiveTab('info');
    setProductName(product?.name   || '');
    setPCategory(product?.category === 'Sides' ? 'Food' : 'Beverage');
    setBevType(
      product?.category === 'Milktea' ? 'Milktea' :
      product?.category === 'Soda'    ? 'Soda'    :
      product?.category === 'Mocktail'? 'Mocktail': 'Coffee'
    );
    setTemperature(product?.temps  || []);
    setAvailable(product?.status  !== 'unavailable');
    setImagePreview(product?.image || null);
    setImageUrl('');
    setVariants(
      (product?.sizes || []).length
        ? (product.sizes).map(s => ({ size: s, price: String(product.price ?? 0) }))
        : [{ size: '12oz', price: '55.00' }]
    );
    setIngredients([{ ingredient: 'Espresso Shot', qty: '10ml' }]);
  }, [open, product]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (f) setImagePreview(URL.createObjectURL(f));
  }

  function handleSave() {
    onSave({
      id:       product?.id || `p${Date.now()}`,
      name:     productName,
      category: pCategory === 'Food' ? 'Sides' : bevType,
      price:    parseFloat(variants[0]?.price || 0),
      sizes:    pCategory === 'Food' ? [] : variants.map(v => v.size),
      temps:    temperature,
      status:   available ? 'available' : 'unavailable',
      image:    imageTab === 'url' ? imageUrl : imagePreview,
    });
    onClose();
  }

  function toggleTemp(t) {
    setTemperature(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  }

  function addVariant()      { setVariants(v => [...v, { size: '8oz', price: '0.00' }]); }
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
                  onChange={e => setProductName(e.target.value)}
                />
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
                <select className="pp-select" value={sizeType} onChange={e => setSizeType(e.target.value)}>
                  <option>Oz</option>
                  <option>S/M/L</option>
                  <option>XS/S/M/L/XL</option>
                  <option>Custom</option>
                </select>
              </div>

              <div className="pp-variants-hdr">
                <label className="pp-label">Sizes in oz</label>
                <button type="button" className="pp-add-link" onClick={addVariant}>+ Add Size</button>
              </div>

              {variants.map((v, i) => (
                <div key={i} className="pp-variant-row">
                  <select
                    className="pp-select pp-select--sm"
                    value={v.size}
                    onChange={e => updateVariant(i, 'size', e.target.value)}
                  >
                    {SIZE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
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
                  <button
                    type="button"
                    className="pp-remove-btn"
                    onClick={() => removeVariant(i)}
                    disabled={variants.length <= 1}
                  >✕</button>
                </div>
              ))}

              <div className="pp-checkbox-row" style={{ marginTop: '12px' }}>
                <input type="checkbox" id="pp-avail-v" defaultChecked />
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
                      {INGREDIENTS_LIST.map(n => <option key={n}>{n}</option>)}
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
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('All');
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [panelMode,   setPanelMode]   = useState('add');
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
    deleteProduct(id);
    setConfirmDeleteId(null);
  }
  function handleSave(data) {
    if (panelMode === 'edit') updateProduct(data);
    else addProduct(data);
  }

  return (
    <div className="adm-content adm-content--products">
      {/* Delete confirm modal */}
      {confirmDeleteId && (() => {
        const p = products.find(x => x.id === confirmDeleteId);
        return p ? (
          <DeleteConfirmModal
            name={p.name}
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
              <tr key={i.id}>
                <td className="adm-bold">{i.name}</td>
                <td>{i.qty} {i.unit}</td>
                <td className="adm-muted">{i.threshold} {i.unit}</td>
                <td><StatusBadge status={i.status} /></td>
                <td>
                  <div className="adm-actions">
                    {restockId === i.id ? (
                      <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                        <input type="number" min="0" className="pp-input" style={{width:'60px',height:'28px',fontSize:'0.8rem'}} value={restockAmt} onChange={e => setRestockAmt(Math.max(0, parseInt(e.target.value,10) || 0))} placeholder="qty" autoFocus />
                        <button className="adm-action-btn adm-action-btn--green" onClick={() => handleRestock(i.id)} title="Confirm">✓</button>
                        <button className="adm-action-btn" onClick={() => setRestockId(null)} title="Cancel">✕</button>
                      </div>
                    ) : (
                      <>
                        <button className="adm-action-btn adm-action-btn--green" title="Restock" onClick={() => { setRestockId(i.id); setRestockAmt(''); setConfirmDeleteId(null); }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                        <button className="adm-action-btn adm-action-btn--red" title="Delete" onClick={() => { setConfirmDeleteId(i.id); setRestockId(null); }}>{Icon.trash}</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COMPONENT: STAMP CARDS VIEW (used by RewardsSection)
   ══════════════════════════════════════════════════ */
function StampCardsView({
  rows, rewards, stampsRequired,
  custNames, typeOpts,
  searchCards, setSearchCards,
  filterType, setFilterType,
  filterCust, setFilterCust,
  onBack,
}) {
  const [editId,    setEditId]    = useState(null);   // user id being edited
  const [editStamps, setEditStamps] = useState('');   // draft stamp value
  const [, forceRerender]          = useState(0);     // force re-read from localStorage

  function startEdit(u) {
    setEditId(u.id);
    setEditStamps(String(u.stamps));
  }

  function saveStamps(userId) {
    const newStamps = Math.max(0, parseInt(editStamps, 10) || 0);
    try {
      const users = JSON.parse(localStorage.getItem('jazsam_users') || '[]');
      const updated = users.map(u =>
        u.id === userId ? { ...u, points: newStamps } : u
      );
      localStorage.setItem('jazsam_users', JSON.stringify(updated));

      // Also update active session if this is the logged-in user
      const session = JSON.parse(localStorage.getItem('jazsam_user') || 'null');
      if (session && session.id === userId) {
        localStorage.setItem('jazsam_user', JSON.stringify({ ...session, points: newStamps }));
      }
    } catch {}
    setEditId(null);
    forceRerender(n => n + 1); // causes a re-read on next render
  }

  // Re-read customers from localStorage each render (so updates are reflected)
  const freshCustomers = (() => {
    try { return JSON.parse(localStorage.getItem('jazsam_users') || '[]'); }
    catch { return []; }
  })();

  const freshRows = freshCustomers
    .filter(u => filterCust === 'All Customers' || u.name === filterCust)
    .filter(u => searchCards === '' || u.name.toLowerCase().includes(searchCards.toLowerCase()))
    .map((u, idx) => {
      const stamps = u.points || 0;
      const pct    = Math.min(100, Math.round((stamps / stampsRequired) * 100));
      const earned = stamps >= stampsRequired;
      const cardNo = String(idx + 100).padStart(5, '0');
      return { ...u, stamps, pct, earned, cardNo };
    });

  return (
    <div className="adm-content">
      <div className="adm-page-header">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',color:'#6b4226',fontWeight:700,fontSize:'1.1rem',padding:0}} title="Back">←</button>
          <div>
            <h1 className="adm-page-title">Customer Stamp Cards &amp; Rewards</h1>
            <p className="adm-page-desc">View and manage customer loyalty stamps.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16,alignItems:'center'}}>
        <div className="adm-search" style={{flex:'1 1 180px',maxWidth:260}}>
          {Icon.search}
          <input type="text" placeholder="Enter Customer Name" value={searchCards} onChange={e => setSearchCards(e.target.value)} />
        </div>
        <select className="pp-select" value={filterType} onChange={e => setFilterType(e.target.value)} style={{flex:'0 0 auto',minWidth:160,maxWidth:200}}>
          {typeOpts.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="pp-select" value={filterCust} onChange={e => setFilterCust(e.target.value)} style={{flex:'0 0 auto',minWidth:140,maxWidth:180}}>
          {custNames.map(n => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div className="adm-card adm-card--flush">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Card No.</th>
              <th>Stamps Collected</th>
              <th>Reward Status</th>
              <th>Reward Name</th>
              <th>Stamps Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {freshRows.length === 0 && (
              <tr><td colSpan="7" className="adm-muted" style={{textAlign:'center',padding:'32px'}}>No registered customers yet.</td></tr>
            )}
            {freshRows.map(u => (
              <tr key={u.id}>
                <td className="adm-bold">{u.name}</td>
                <td className="adm-mono">{u.cardNo}</td>
                <td>
                  {editId === u.id ? (
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <input
                        type="number"
                        min="0"
                        className="pp-input"
                        style={{width:'60px',height:'28px',fontSize:'0.85rem'}}
                        value={editStamps}
                        onChange={e => setEditStamps(Math.max(0, parseInt(e.target.value,10)||0))}
                        autoFocus
                      />
                      <span style={{fontSize:'0.8rem',color:'#888'}}>/ {stampsRequired}</span>
                    </div>
                  ) : (
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{minWidth:18,fontWeight:700,fontSize:'0.9rem'}}>{u.stamps}</span>
                      <div style={{flex:1,height:10,borderRadius:99,background:'#f0ebe4',overflow:'hidden',minWidth:100}}>
                        <div style={{height:'100%',width:`${u.pct}%`,borderRadius:99,background: u.earned ? '#22c55e' : u.pct >= 50 ? '#f59e0b' : '#d4c5f0',transition:'width 0.4s'}} />
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  {u.earned
                    ? <span style={{color:'#22c55e',fontWeight:700,fontSize:'0.82rem'}}>✓ Reward Earned</span>
                    : <span className="adm-muted">–</span>}
                </td>
                <td className="adm-muted">{u.earned && rewards.length > 0 ? rewards[0].name : '–'}</td>
                <td>{stampsRequired}</td>
                <td>
                  {editId === u.id ? (
                    <div style={{display:'flex',gap:6}}>
                      <button
                        onClick={() => saveStamps(u.id)}
                        style={{fontSize:'0.78rem',padding:'6px 12px',background:'#22c55e',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600}}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={{fontSize:'0.78rem',padding:'6px 10px',background:'#f0ebe4',color:'#333',border:'none',borderRadius:8,cursor:'pointer'}}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(u)}
                      style={{fontSize:'0.78rem',padding:'6px 12px',background:'#5b4fcf',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',gap:6,whiteSpace:'nowrap'}}
                      title="Update stamp count"
                    >
                      {Icon.edit} Update Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: REWARDS
   ══════════════════════════════════════════════════ */
function RewardsSection() {
  const { rewards, addReward, deleteReward } = useStore();
  const [confirmId,   setConfirmId]   = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [showCards,   setShowCards]   = useState(false);
  const [searchCards, setSearchCards] = useState('');
  const [filterType,  setFilterType]  = useState('All Reward Types');
  const [filterCust,  setFilterCust]  = useState('All Customers');

  /* New reward form state */
  const [form, setForm] = useState({ name: '', type: 'Discount – Fixed Amount', value: '', stamps: 10 });
  const TYPES = ['Discount – Fixed Amount', 'Discount – Percentage', 'Free Item'];

  /* Read registered customers for stamp cards view */
  const allCustomers = (() => {
    try { return JSON.parse(localStorage.getItem('jazsam_users') || '[]'); }
    catch { return []; }
  })();

  function handleDelete(id) {
    deleteReward(id);
    setConfirmId(null);
  }

  function handleAddReward() {
    if (!form.name.trim() || !form.value.trim()) return;
    addReward({ ...form, stamps: Number(form.stamps) || 10 });
    setForm({ name: '', type: 'Discount – Fixed Amount', value: '', stamps: 10 });
    setShowAdd(false);
  }

  /* ── Customer Stamp Card detail view ── */
  if (showCards) {
    const stampsRequired = rewards.length > 0 ? rewards[0].stamps : 10;
    const custNames = ['All Customers', ...allCustomers.map(u => u.name)];
    const typeOpts  = ['All Reward Types', ...rewards.map(r => r.name)];

    const rows = allCustomers
      .filter(u => filterCust === 'All Customers' || u.name === filterCust)
      .filter(u => searchCards === '' || u.name.toLowerCase().includes(searchCards.toLowerCase()))
      .map((u, idx) => {
        const stamps = u.points || 0;
        const pct    = Math.min(100, Math.round((stamps / stampsRequired) * 100));
        const earned = stamps >= stampsRequired;
        const cardNo = String(idx + 100).padStart(5, '0');
        return { ...u, stamps, pct, earned, cardNo };
      });

    return (
      <StampCardsView
        rows={rows}
        rewards={rewards}
        stampsRequired={stampsRequired}
        custNames={custNames}
        typeOpts={typeOpts}
        searchCards={searchCards} setSearchCards={setSearchCards}
        filterType={filterType} setFilterType={setFilterType}
        filterCust={filterCust} setFilterCust={setFilterCust}
        onBack={() => setShowCards(false)}
      />
    );
  }

  /* ── Main Rewards view ── */
  return (
    <div className="adm-content">
      {/* Delete confirm modal */}
      {confirmId && (() => {
        const r = rewards.find(x => x.id === confirmId);
        return r ? (
          <DeleteConfirmModal
            name={r.name}
            onConfirm={() => handleDelete(confirmId)}
            onCancel={() => setConfirmId(null)}
          />
        ) : null;
      })()}

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Stamp Rewards</h1>
          <p className="adm-page-desc">Configure loyalty rewards and stamp programs.</p>
        </div>
        <button className="adm-btn-add" onClick={() => setShowAdd(v => !v)}>{Icon.plus} Add a reward</button>
      </div>

      {/* Add Reward Form */}
      {showAdd && (
        <div className="adm-card" style={{marginBottom:16}}>
          <div className="adm-card-hdr"><h3>New Reward</h3></div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end',padding:'0 0 8px'}}>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Name</label>
              <input className="pp-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Reward 5" style={{width:'140px'}} /></div>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Type</label>
              <select className="pp-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{width:'200px'}}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select></div>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Value</label>
              <input className="pp-input" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="e.g. ₱20.00 Off" style={{width:'150px'}} /></div>
            <div><label style={{fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:4}}>Stamps Needed</label>
              <input className="pp-input" type="number" min="1" value={form.stamps} onChange={e => setForm({...form, stamps: Math.max(1, parseInt(e.target.value,10)||1)})} style={{width:'80px'}} /></div>
            <button className="pp-submit" style={{height:'36px'}} onClick={handleAddReward}>Add</button>
            <button className="pp-cancel" style={{height:'36px'}} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Clickable Banner */}
      <button
        className="adm-rewards-banner"
        style={{width:'100%',textAlign:'left',border:'none',cursor:'pointer'}}
        onClick={() => setShowCards(true)}
      >
        <div className="adm-rewards-banner__text">
          <span>Customer Stamp Cards &amp; Rewards</span>
          <p>Manage all customer stamp cards and applied rewards.</p>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div className="adm-count-pills" style={{ marginTop: '0' }}>
        <span className="adm-pill">{rewards.length} rewards</span>
      </div>
      <div className="adm-card adm-card--flush">
        <table className="adm-table">
          <thead><tr><th>Reward Name / Type</th><th>Value</th><th>Stamps Required</th><th>Actions</th></tr></thead>
          <tbody>
            {rewards.length === 0 && <tr><td colSpan="4" className="adm-muted" style={{textAlign:'center',padding:'24px'}}>No rewards yet. Add one above.</td></tr>}
            {rewards.map(r => (
              <tr key={r.id}>
                <td><strong>{r.name}</strong><div className="adm-muted" style={{fontSize:'0.78rem',marginTop:2}}>{r.type}</div></td>
                <td className="adm-bold">{r.value}</td>
                <td>{r.stamps}</td>
                <td><div className="adm-actions">
                  <button className="adm-action-btn adm-action-btn--red" onClick={() => setConfirmId(r.id)}>{Icon.trash}</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: ORDERS
   ══════════════════════════════════════════════════ */
function OrdersSection() {
  const { orders, updateOrderStatus } = useStore();
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('All');
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const statuses = ['All', 'Pending', 'Preparing', 'Completed', 'Cancelled'];
  const filtered = orders.filter(o =>
    (filter === 'All' || o.status === filter) &&
    ((o.id || '').includes(search) || (o.customer || o.userId || '').toLowerCase().includes(search.toLowerCase()))
  );

  function cycleStatus(order) {
    const flow = { 'Pending': 'Preparing', 'Preparing': 'Completed' };
    const next = flow[order.status];
    if (next) { updateOrderStatus(order.id, next); setConfirmCancelId(null); }
  }
  function cancelOrder(id) {
    updateOrderStatus(id, 'Cancelled');
    setConfirmCancelId(null);
  }

  return (
    <div className="adm-content">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Orders</h1>
          <p className="adm-page-desc">View and manage all customer orders.</p>
        </div>
      </div>
      <div className="adm-filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by order ID or customer" />
        <div className="adm-filter-tabs">
          {statuses.map(s => (
            <button key={s} className={`adm-filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="adm-count-pills">
        <span className="adm-pill">{orders.length} total</span>
        <span className="adm-pill adm-pill--yellow">{orders.filter(o=>o.status==='Pending').length} pending</span>
        <span className="adm-pill adm-pill--green">{orders.filter(o=>o.status==='Completed').length} completed</span>
      </div>
      <div className="adm-card adm-card--flush">
        <table className="adm-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="adm-mono">{o.id}</td>
                <td>{o.customer || o.userId || 'Guest'}</td>
                <td className="adm-muted" style={{maxWidth:'180px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{(o.items||[]).join(', ')}</td>
                <td className="adm-bold">₱{o.total}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="adm-muted" style={{fontSize:'0.8rem'}}>{o.date}</td>
                <td>
                  <div className="adm-actions">
                    {confirmCancelId === o.id ? (
                      <>
                        <span style={{fontSize:'0.75rem',color:'#ef4444',fontWeight:600}}>Cancel order?</span>
                        <button className="adm-action-btn adm-action-btn--red" onClick={() => cancelOrder(o.id)}>Yes</button>
                        <button className="adm-action-btn" onClick={() => setConfirmCancelId(null)}>No</button>
                      </>
                    ) : (
                      <>
                        {(o.status === 'Pending' || o.status === 'Preparing') && (
                          <button className="adm-action-btn adm-action-btn--green" title={o.status==='Pending'?'Start Preparing':'Mark Completed'} onClick={() => cycleStatus(o)}>✓</button>
                        )}
                        {o.status !== 'Completed' && o.status !== 'Cancelled' && (
                          <button className="adm-action-btn adm-action-btn--red" title="Cancel" onClick={() => setConfirmCancelId(o.id)}>✕</button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" className="adm-muted" style={{textAlign:'center',padding:'24px'}}>No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: EMPLOYEES
   ══════════════════════════════════════════════════ */
function EmployeesSection() {
  const { employees, deleteEmployee } = useStore();
  const [search, setSearch]   = useState('');
  const [posFilter, setPos]   = useState('All Positions');
  const [statFilter, setStat] = useState('All Statuses');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const positions = ['All Positions', ...new Set(employees.map(e => e.position))];
  const statuses  = ['All Statuses', 'Active', 'Inactive'];
  const filtered = employees.filter(e =>
    (posFilter  === 'All Positions' || e.position === posFilter) &&
    (statFilter === 'All Statuses'  || e.status   === statFilter) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.empId.includes(search))
  );
  const baristas = employees.filter(e => e.position === 'Barista').length;
  const cashiers = employees.filter(e => e.position === 'Cashier').length;
  function handleDelete(id) { deleteEmployee(id); setConfirmDeleteId(null); }

  return (
    <div className="adm-content">
      {/* Delete confirm modal */}
      {confirmDeleteId && (() => {
        const emp = employees.find(x => x.id === confirmDeleteId);
        return emp ? (
          <DeleteConfirmModal
            name={emp.name}
            onConfirm={() => handleDelete(confirmDeleteId)}
            onCancel={() => setConfirmDeleteId(null)}
          />
        ) : null;
      })()}

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Manage Employees</h1>
          <p className="adm-page-desc">View, add, and manage your team members.</p>
        </div>
        <button className="adm-btn-add">{Icon.plus} Add employee</button>
      </div>

      <div className="adm-filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Enter Employee Name" />
        <select className="adm-select" value={posFilter} onChange={e => setPos(e.target.value)}>
          {positions.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="adm-select" value={statFilter} onChange={e => setStat(e.target.value)}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="adm-count-pills">
        <span className="adm-pill">{employees.length} total</span>
        <span className="adm-pill">{baristas} barista{baristas !== 1 ? 's' : ''}</span>
        <span className="adm-pill">{cashiers} cashier{cashiers !== 1 ? 's' : ''}</span>
      </div>

      <div className="adm-card adm-card--flush">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Employee ID</th><th>Employee Name</th><th>Position</th><th>Status</th><th>Username</th><th>Email</th><th>Phone</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td className="adm-mono">{e.empId}</td>
                <td className="adm-bold">{e.name}</td>
                <td>{e.position}</td>
                <td><StatusBadge status={e.status} /></td>
                <td className="adm-muted">{e.username}</td>
                <td className="adm-muted">{e.email}</td>
                <td className="adm-muted">{e.phone}</td>
                <td>
                  <div className="adm-actions">
                    <button className="adm-action-btn adm-action-btn--blue">{Icon.edit}</button>
                    <button className="adm-action-btn adm-action-btn--red" onClick={() => setConfirmDeleteId(e.id)}>{Icon.trash}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: SETTINGS
   ══════════════════════════════════════════════════ */
function SettingsSection({ onLogout }) {
  const session = getAdminSession();
  return (
    <div className="adm-content">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Settings</h1>
          <p className="adm-page-desc">Manage admin account and system preferences.</p>
        </div>
      </div>

      {/* Admin account card */}
      <div className="adm-card">
        <div className="adm-card-hdr"><h3>Admin Account</h3></div>
        <div className="adm-settings-profile">
          <div className="adm-settings-avatar">A</div>
          <div>
            <p className="adm-bold">{session?.name || 'Admin'}</p>
            <p className="adm-muted" style={{ fontSize:'0.85rem' }}>{session?.email}</p>
            <p className="adm-muted" style={{ fontSize:'0.78rem', marginTop:'4px' }}>
              Logged in: {session?.loginAt ? new Date(session.loginAt).toLocaleString('en-PH') : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Store info */}
      <div className="adm-card">
        <div className="adm-card-hdr"><h3>Store Information</h3></div>
        <div className="adm-settings-grid">
          {[
            { label: 'Store Name',    value: 'JazSam Coffee & Treats' },
            { label: 'Currency',      value: 'PHP (₱)' },
            { label: 'Points Rate',   value: '1 point per ₱10 spent' },
            { label: 'Stamp Goal',    value: '10 stamps per reward' },
          ].map(f => (
            <div key={f.label} className="adm-settings-field">
              <label>{f.label}</label>
              <input type="text" defaultValue={f.value} />
            </div>
          ))}
        </div>
        <button className="adm-btn-save">Save Changes</button>
      </div>

      {/* Danger zone */}
      <div className="adm-card adm-card--danger">
        <div className="adm-card-hdr"><h3>Session</h3></div>
        <p className="adm-muted" style={{ marginBottom:'16px', fontSize:'0.875rem' }}>
          End your current admin session and return to the login page.
        </p>
        <button className="adm-btn-logout" onClick={onLogout}>
          {Icon.logout} Sign Out
        </button>
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
        {/* Topbar */}
        <header className="adm-topbar">
          <button className="adm-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="adm-topbar-title">
            {NAV_ITEMS.find(n => n.id === active)?.label || 'Dashboard'}
          </span>
          <div className="adm-topbar-right">
            <button className="adm-topbar-notif" title="Go to store" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
            <div className="adm-topbar-avatar" title={session?.email}>
              {session?.name?.[0] || 'A'}
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

/**
 * StoreContext — data layer that syncs with salespresso_db via PHP API.
 *
 * API base: http://localhost/salespresso-api
 * Falls back to DEFAULT data when the API is unreachable (e.g. XAMPP offline).
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const StoreContext = createContext(null);

const API = 'http://localhost/salespresso-api';

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseMaybeJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeStringArray(value) {
  return parseMaybeJsonArray(value).map(v => String(v)).filter(Boolean);
}

function normalizeVariants(value) {
  return parseMaybeJsonArray(value).map((v, idx) => ({
    variantId: v?.variantId ?? null,
    size: v?.size ?? null,
    price: toNumber(v?.price, 0),
    _key: v?.variantId ?? `${idx}`,
  }));
}

function normalizeProduct(p) {
  const variants = normalizeVariants(p?.variants);
  const variantPrice = variants.find(v => v.price > 0)?.price ?? 0;
  const basePrice = toNumber(p?.price, 0);
  return {
    ...p,
    name: p?.name || '',
    category: p?.category || 'Coffee',
    price: basePrice > 0 ? basePrice : variantPrice,
    sizes: normalizeStringArray(p?.sizes),
    temps: normalizeStringArray(p?.temps),
    status: p?.status === 'unavailable' ? 'unavailable' : 'available',
    image: p?.image || '',
    variants,
  };
}

/* ── Defaults (used as fallback when API is unreachable) ── */
const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Jazsam Classic',   category: 'Coffee',  price: 120, sizes: ['Small','Medium','Large'], temps: [],             status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p2', name: 'Hazelnut Latte',   category: 'Coffee',  price: 130, sizes: [],                         temps: ['Hot','Iced'],  status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p3', name: 'Matcha Milktea',   category: 'Milktea', price: 95,  sizes: ['Medium','Large'],         temps: [],             status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p4', name: 'Lemon Fruit Soda', category: 'Soda',    price: 80,  sizes: ['Small','Medium','Large'], temps: [],             status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p5', name: 'Overload Burger',  category: 'Sides',   price: 150, sizes: [],                         temps: [],             status: 'unavailable', image: '/cappuccino_cup.png' },
  { id: 'p6', name: 'Latte Macchiato',  category: 'Coffee',  price: 140, sizes: [],                         temps: ['Hot','Iced'],  status: 'available',   image: '/cappuccino_cup.png' },
];

const DEFAULT_INVENTORY = [
  { id: 'i1', name: 'Ready-To-Fry French Fries', qty: 500,  unit: 'g',   status: 'In Stock',     threshold: 100 },
  { id: 'i2', name: 'Orange Juice',               qty: 1300, unit: 'ml',  status: 'In Stock',     threshold: 200 },
  { id: 'i3', name: 'Coffee Beans',               qty: 70,   unit: 'g',   status: 'Low Stock',    threshold: 100 },
  { id: 'i4', name: 'Lemon',                      qty: 3,    unit: 'pcs', status: 'Out of Stock', threshold: 10  },
  { id: 'i5', name: 'Milk',                       qty: 2000, unit: 'ml',  status: 'In Stock',     threshold: 300 },
];

const DEFAULT_REWARDS = [
  { id: 'r1', name: 'Reward 1', type: 'Discount – Fixed Amount', value: '₱20.00 Off',         stamps: 10, rawType: 'Fixed Amount', rawValue: 20   },
  { id: 'r2', name: 'Reward 2', type: 'Free Item',               value: 'Free Jazsam Classic', stamps: 10, rawType: 'Free Item',    rawValue: 0    },
  { id: 'r3', name: 'Reward 3', type: 'Discount – Percentage',   value: '10% Off',             stamps: 10, rawType: 'Percentage',   rawValue: 10   },
  { id: 'r4', name: 'Reward 4', type: 'Free Item',               value: 'Free Latte',          stamps: 10, rawType: 'Free Item',    rawValue: 0    },
];

const DEFAULT_EMPLOYEES = [
  { id: 'e1', empId: '000213', name: 'Sarah del Rosario', position: 'Barista',  status: 'Active',   username: 'sarah.delrosario', email: 'sdr000213@gmail.com', phone: '09171234567' },
  { id: 'e2', empId: '003290', name: 'Alvin Garcia',      position: 'Cashier',  status: 'Active',   username: 'alvin.garcia',      email: 'ag003290@gmail.com',  phone: '09281234567' },
];

/* ── Simple fetch helpers ── */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function StoreProvider({ children }) {
  const [products,  setProducts]  = useState(DEFAULT_PRODUCTS);
  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [rewards,   setRewards]   = useState(DEFAULT_REWARDS);
  const [employees, setEmployees] = useState(DEFAULT_EMPLOYEES);
  const [orders,    setOrders]    = useState([]);
  const [apiOnline, setApiOnline] = useState(false);

  /* ── Load all data from API on mount ── */
  useEffect(() => {
    Promise.allSettled([
      apiFetch('products.php'),
      apiFetch('ingredients.php'),
      apiFetch('rewards.php'),
      apiFetch('employees.php'),
    ]).then(([prodRes, invRes, rwdRes, empRes]) => {
      let online = false;
      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value) && prodRes.value.length > 0) {
        setProducts(prodRes.value.map(normalizeProduct));
        online = true;
      } else if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value)) {
        // API reachable but DB is empty — keep defaults visible so the UI isn't blank
        online = true;
      }
      if (invRes.status  === 'fulfilled' && Array.isArray(invRes.value))  setInventory(invRes.value);
      if (rwdRes.status  === 'fulfilled' && Array.isArray(rwdRes.value))  setRewards(rwdRes.value);
      if (empRes.status  === 'fulfilled' && Array.isArray(empRes.value))  setEmployees(empRes.value);
      setApiOnline(online);
    });
  }, []);

  /* ── Orders: fetched from API, refreshed on custom event ── */
  const loadOrders = useCallback(async () => {
    try {
      const res   = await fetch(`${API}/orders.php`);
      const fresh = await res.json();
      if (Array.isArray(fresh)) setOrders(fresh);
    } catch {}
  }, []);

  useEffect(() => {
    loadOrders();
    window.addEventListener('jazsam_orders_updated', loadOrders);
    return () => window.removeEventListener('jazsam_orders_updated', loadOrders);
  }, [loadOrders]);

  /* ════════════════════════════════════════
     PRODUCT CRUD
     ════════════════════════════════════════ */
  async function addProduct(p) {
    const normalized = normalizeProduct(p);
    try {
      const payload = buildProductPayload(normalized);
      const result  = await apiFetch('products.php', { method: 'POST', body: JSON.stringify(payload) });
      const savedId = result.id ?? normalized.id ?? `p${Date.now()}`;
      setProducts(ps => [...ps, { ...normalized, id: savedId }]);
      return savedId;
    } catch {
      /* fallback: local only */
      const id = normalized.id || `p${Date.now()}`;
      setProducts(ps => [...ps, { ...normalized, id }]);
      return id;
    }
  }

  async function updateProduct(p) {
    const normalized = normalizeProduct(p);
    /* Optimistic update */
    setProducts(ps => ps.map(x => x.id === normalized.id ? normalized : x));
    try {
      await apiFetch('products.php', { method: 'PUT', body: JSON.stringify(buildProductPayload(normalized)) });
    } catch {}
  }

  async function deleteProduct(id) {
    setProducts(ps => ps.filter(x => x.id !== id));
    try {
      await apiFetch(`products.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }

  /* ════════════════════════════════════════
     INVENTORY CRUD
     ════════════════════════════════════════ */
  async function addInventory(item) {
    try {
      const result  = await apiFetch('ingredients.php', { method: 'POST', body: JSON.stringify(item) });
      const savedId = result.id ?? item.id ?? `i${Date.now()}`;
      setInventory(is => [...is, { ...item, id: savedId }]);
    } catch {
      setInventory(is => [...is, { ...item, id: item.id || `i${Date.now()}` }]);
    }
  }

  async function updateInventory(item) {
    setInventory(is => is.map(x => x.id === item.id ? item : x));
    try {
      await apiFetch('ingredients.php', { method: 'PUT', body: JSON.stringify(item) });
    } catch {}
  }

  async function deleteInventory(id) {
    setInventory(is => is.filter(x => x.id !== id));
    try {
      await apiFetch(`ingredients.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }

  async function restockInventory(id, amount) {
    setInventory(is => is.map(x => {
      if (x.id !== id) return x;
      const newQty = x.qty + amount;
      const status = newQty <= 0 ? 'Out of Stock' : newQty <= x.threshold ? 'Low Stock' : 'In Stock';
      const updated = { ...x, qty: newQty, status };
      /* Sync to DB */
      apiFetch('ingredients.php', { method: 'PUT', body: JSON.stringify({ id, qty: newQty }) }).catch(() => {});
      return updated;
    }));
  }

  /* ════════════════════════════════════════
     REWARDS CRUD
     ════════════════════════════════════════ */
  async function addReward(r) {
    try {
      const result  = await apiFetch('rewards.php', { method: 'POST', body: JSON.stringify(r) });
      const savedId = result.id ?? r.id ?? `r${Date.now()}`;
      setRewards(rs => [...rs, { ...r, id: savedId }]);
    } catch {
      setRewards(rs => [...rs, { ...r, id: r.id || `r${Date.now()}` }]);
    }
  }

  async function updateReward(r) {
    setRewards(rs => rs.map(x => x.id === r.id ? r : x));
    try {
      await apiFetch('rewards.php', { method: 'PUT', body: JSON.stringify(r) });
    } catch {}
  }

  async function deleteReward(id) {
    setRewards(rs => rs.filter(x => x.id !== id));
    try {
      await apiFetch(`rewards.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }

  /* ════════════════════════════════════════
     EMPLOYEES CRUD
     ════════════════════════════════════════ */
  async function addEmployee(e) {
    try {
      const result  = await apiFetch('employees.php', { method: 'POST', body: JSON.stringify(buildEmployeePayload(e)) });
      const savedId = result.id ?? e.id ?? `e${Date.now()}`;
      setEmployees(es => [...es, { ...e, id: savedId }]);
    } catch {
      setEmployees(es => [...es, { ...e, id: e.id || `e${Date.now()}` }]);
    }
  }

  async function updateEmployee(e) {
    setEmployees(es => es.map(x => x.id === e.id ? e : x));
    try {
      await apiFetch('employees.php', { method: 'PUT', body: JSON.stringify(buildEmployeePayload(e)) });
    } catch {}
  }

  async function deleteEmployee(id) {
    setEmployees(es => es.filter(x => x.id !== id));
    try {
      await apiFetch(`employees.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }

  /* ── Order status update — optimistic local + persist to API ── */
  function updateOrderStatus(id, status) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
    fetch(`${API}/orders.php`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, status }),
    }).catch(() => {});
  }

  const value = {
    products,  addProduct,  updateProduct,  deleteProduct,
    inventory, addInventory, updateInventory, deleteInventory, restockInventory,
    rewards,   addReward,   updateReward,   deleteReward,
    employees, addEmployee, updateEmployee, deleteEmployee,
    orders,    updateOrderStatus,
    apiOnline,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

/* ══════════════════════════════════════════════
   Private helpers — shape data for the API
   ============================================== */
function buildProductPayload(p) {
  return {
    id:       p.id,
    name:     p.name,
    category: p.category,
    price:    p.price,
    sizes:    p.sizes  || [],
    temps:    p.temps  || [],
    status:   p.status,
    image:    p.image  || '',
    variants: (p.variants || []).map(v => ({
      variantId: v.variantId,
      size:      v.size,
      price:     v.price,
    })),
  };
}

function buildEmployeePayload(e) {
  const nameParts = (e.name || '').trim().split(' ');
  return {
    id:        e.id,
    firstName: nameParts[0] || '',
    lastName:  nameParts.slice(1).join(' ') || '',
    position:  e.position || 'Cashier',
    username:  e.username || '',
    email:     e.email    || '',
    phone:     e.phone    || '',
    password:  e.password || '',
  };
}

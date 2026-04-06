/**
 * StoreContext — Shared localStorage data layer for admin + customer sync.
 *
 * Keys:
 *   jazsam_products   – products managed by admin, read by Menu
 *   jazsam_inventory  – inventory items
 *   jazsam_rewards    – stamp rewards
 *   jazsam_employees  – employee records
 *   jazsam_orders     – orders (already used by OrdersContext)
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const StoreContext = createContext(null);

/* ── Defaults (seed data when nothing in localStorage) ── */
const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Jazsam Classic',   category: 'Coffee',  price: 120, sizes: ['S','M','L'],  temps: [],            status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p2', name: 'Hazelnut Latte',   category: 'Coffee',  price: 130, sizes: [],             temps: ['Hot','Iced'], status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p3', name: 'Matcha Milktea',   category: 'Milktea', price: 95,  sizes: ['M','L'],      temps: [],            status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p4', name: 'Lemon Fruit Soda', category: 'Soda',    price: 80,  sizes: ['S','M','L'],  temps: [],            status: 'available',   image: '/cappuccino_cup.png' },
  { id: 'p5', name: 'Overload Burger',  category: 'Sides',   price: 150, sizes: [],             temps: [],            status: 'unavailable', image: '/cappuccino_cup.png' },
  { id: 'p6', name: 'Latte Macchiato',  category: 'Coffee',  price: 140, sizes: [],             temps: ['Hot','Iced'], status: 'available',   image: '/cappuccino_cup.png' },
];

const DEFAULT_INVENTORY = [
  { id: 'i1', name: 'Ready-To-Fry French Fries', qty: 500,  unit: 'g',   status: 'In Stock',     threshold: 100 },
  { id: 'i2', name: 'Orange Juice',               qty: 1300, unit: 'ml',  status: 'In Stock',     threshold: 200 },
  { id: 'i3', name: 'Coffee Beans',               qty: 70,   unit: 'g',   status: 'Low Stock',    threshold: 100 },
  { id: 'i4', name: 'Lemon',                      qty: 3,    unit: 'pcs', status: 'Out of Stock', threshold: 10 },
  { id: 'i5', name: 'Milk',                       qty: 2000, unit: 'ml',  status: 'In Stock',     threshold: 300 },
];

const DEFAULT_REWARDS = [
  { id: 'r1', name: 'Reward 1', type: 'Discount – Fixed Amount', value: '₱20.00 Off',         stamps: 10 },
  { id: 'r2', name: 'Reward 2', type: 'Free Item',               value: 'Free Jazsam Classic', stamps: 10 },
  { id: 'r3', name: 'Reward 3', type: 'Discount – Percentage',   value: '10% Off',             stamps: 10 },
  { id: 'r4', name: 'Reward 4', type: 'Free Item',               value: 'Free Latte',          stamps: 10 },
];

const DEFAULT_EMPLOYEES = [
  { id: 'e1', empId: '000213', name: 'Sarah del Rosario', position: 'Barista',  status: 'Active',   username: 'sarah.delrosario', email: 'sdr000213@gmail.com', phone: '09171234567' },
  { id: 'e2', empId: '003290', name: 'Alvin Garcia',      position: 'Cashier',  status: 'Active',   username: 'alvin.garcia',      email: 'ag003290@gmail.com',  phone: '09281234567' },
  { id: 'e3', empId: '003100', name: 'Emily Ramirez',     position: 'Cashier',  status: 'Active',   username: 'emily.ramirez',     email: 'er003100@gmail.com',  phone: '09391234567' },
  { id: 'e4', empId: '004010', name: 'Marco Santos',      position: 'Barista',  status: 'Inactive', username: 'marco.santos',      email: 'ms004010@gmail.com',  phone: '09451234567' },
];

/* ── Generic persisted-state hook ── */
function usePersistedState(key, defaults) {
  const [data, setDataRaw] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      return stored && stored.length > 0 ? stored : defaults;
    } catch { return defaults; }
  });

  const setData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [data, setData];
}

export function StoreProvider({ children }) {
  const [products,  setProducts]  = usePersistedState('jazsam_products',  DEFAULT_PRODUCTS);
  const [inventory, setInventory] = usePersistedState('jazsam_inventory', DEFAULT_INVENTORY);
  const [rewards,   setRewards]   = usePersistedState('jazsam_rewards',   DEFAULT_REWARDS);
  const [employees, setEmployees] = usePersistedState('jazsam_employees', DEFAULT_EMPLOYEES);

  /* Orders - synced with OrdersContext via custom event */
  const [orders, setOrders] = usePersistedState('jazsam_orders', []);

  /* Listen for order updates from OrdersContext */
  useEffect(() => {
    function handleOrderUpdate() {
      try {
        const fresh = JSON.parse(localStorage.getItem('jazsam_orders') || '[]');
        setOrders(fresh);
      } catch {}
    }
    window.addEventListener('jazsam_orders_updated', handleOrderUpdate);
    return () => window.removeEventListener('jazsam_orders_updated', handleOrderUpdate);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Product CRUD ── */
  function addProduct(p)    { setProducts(ps => [...ps, { ...p, id: p.id || `p${Date.now()}` }]); }
  function updateProduct(p) { setProducts(ps => ps.map(x => x.id === p.id ? p : x)); }
  function deleteProduct(id){ setProducts(ps => ps.filter(x => x.id !== id)); }

  /* ── Inventory CRUD ── */
  function addInventory(item)    { setInventory(is => [...is, { ...item, id: item.id || `i${Date.now()}` }]); }
  function updateInventory(item) { setInventory(is => is.map(x => x.id === item.id ? item : x)); }
  function deleteInventory(id)   { setInventory(is => is.filter(x => x.id !== id)); }
  function restockInventory(id, amount) {
    setInventory(is => is.map(x => {
      if (x.id !== id) return x;
      const newQty = x.qty + amount;
      let status = 'In Stock';
      if (newQty <= 0) status = 'Out of Stock';
      else if (newQty <= x.threshold) status = 'Low Stock';
      return { ...x, qty: newQty, status };
    }));
  }

  /* ── Rewards CRUD ── */
  function addReward(r)    { setRewards(rs => [...rs, { ...r, id: r.id || `r${Date.now()}` }]); }
  function updateReward(r) { setRewards(rs => rs.map(x => x.id === r.id ? r : x)); }
  function deleteReward(id){ setRewards(rs => rs.filter(x => x.id !== id)); }

  /* ── Employee CRUD ── */
  function addEmployee(e)    { setEmployees(es => [...es, { ...e, id: e.id || `e${Date.now()}` }]); }
  function updateEmployee(e) { setEmployees(es => es.map(x => x.id === e.id ? e : x)); }
  function deleteEmployee(id){ setEmployees(es => es.filter(x => x.id !== id)); }

  /* ── Order status update ── */
  function updateOrderStatus(id, status) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  }

  const value = {
    products, addProduct, updateProduct, deleteProduct,
    inventory, addInventory, updateInventory, deleteInventory, restockInventory,
    rewards, addReward, updateReward, deleteReward,
    employees, addEmployee, updateEmployee, deleteEmployee,
    orders, updateOrderStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

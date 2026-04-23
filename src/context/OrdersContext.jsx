import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

const OrdersContext = createContext(null);

const API = 'http://localhost/salespresso-api';

export function OrdersProvider({ children }) {
  const { user, addPoints } = useAuth();
  const store = useStore();

  async function placeOrder(cartItems, note = '') {
    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const items = cartItems.map(i => `${i.qty}x ${i.name}`);

    const payload = {
      userId:    user?.id    || 'guest',
      customer:  user?.name  || 'Guest',
      items,
      cartItems,
      total,
      note: note || '',
    };

    let newOrder = null;
    try {
      const res = await fetch(`${API}/orders.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      newOrder = await res.json();
    } catch {
      // Fallback: build an in-memory order if API is offline
      const now = new Date();
      newOrder = {
        id:        `#${Math.floor(100000 + Math.random() * 900000)}`,
        userId:    user?.id || 'guest',
        customer:  user?.name || 'Guest',
        date:      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                   + ' · '
                   + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        items,
        total,
        note:      note || '',
        status:    'Pending',
        expiresIn: '15 minutes',
      };
    }

    // Notify StoreContext to reload orders from API
    window.dispatchEvent(new Event('jazsam_orders_updated'));

    // Award 1 point per item ordered
    if (user && addPoints) {
      const pointsEarned = cartItems.reduce((sum, item) => sum + item.qty, 0);
      if (pointsEarned > 0) addPoints(pointsEarned);
    }

    return newOrder;
  }

  // Filter orders for the current user (store fetches from API)
  const allOrders  = store.orders;
  const userOrders = user
    ? allOrders.filter(o => o.userId === user.id)
    : allOrders;

  return (
    <OrdersContext.Provider value={{ orders: userOrders, allOrders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}

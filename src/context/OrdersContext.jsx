import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jazsam_orders')) || []; }
    catch { return []; }
  });
  const { user, addPoints } = useAuth();

  function placeOrder(cartItems, note = '') {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

    const newOrder = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user?.id || 'guest',
      date: `${dateStr} · ${timeStr}`,
      items: cartItems.map(i => `${i.qty}x ${i.name}`),
      total,
      note: note || '',
      status: 'Pending',
      expiresIn: '15 minutes',
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('jazsam_orders', JSON.stringify(updated));

    // Award points: 1 point per ₱10 spent
    if (user && addPoints) {
      const pointsEarned = Math.floor(total / 10);
      if (pointsEarned > 0) addPoints(pointsEarned);
    }

    return newOrder;
  }

  // Filter orders for the current user
  const userOrders = user
    ? orders.filter(o => o.userId === user.id || o.userId === 'guest')
    : orders;

  return (
    <OrdersContext.Provider value={{ orders: userOrders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}

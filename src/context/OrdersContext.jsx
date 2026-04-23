import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const { user, addPoints } = useAuth();
  const store = useStore();

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
      customer: user?.name || 'Guest',
      date: `${dateStr} · ${timeStr}`,
      items: cartItems.map(i => `${i.qty}x ${i.name}`),
      total,
      note: note || '',
      status: 'Pending',
      expiresIn: '15 minutes',
    };

    const currentOrders = JSON.parse(localStorage.getItem('jazsam_orders') || '[]');
    const updated = [newOrder, ...currentOrders];
    localStorage.setItem('jazsam_orders', JSON.stringify(updated));

    // Force a re-render by updating StoreContext directly
    // The StoreContext reads from localStorage, so forceRefresh by dispatching storage event
    window.dispatchEvent(new Event('jazsam_orders_updated'));

    // Award points: 1 point per ₱10 spent
    if (user && addPoints) {
      const pointsEarned = Math.floor(total / 10);
      if (pointsEarned > 0) addPoints(pointsEarned);
    }

    return newOrder;
  }

  // Filter orders for the current user from the store
  const allOrders = store.orders;
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

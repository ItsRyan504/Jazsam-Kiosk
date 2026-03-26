import { createContext, useContext, useState } from 'react';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  function placeOrder(cartItems, note = '') {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

    const newOrder = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      date: `${dateStr} · ${timeStr}`,
      items: cartItems.map(i => `${i.qty}x ${i.name}`),
      total: cartItems.reduce((s, i) => s + i.price * i.qty, 0),
      note: note || '',
      status: 'Pending',
      expiresIn: '15 minutes',
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}

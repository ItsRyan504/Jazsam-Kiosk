import { useState } from 'react';
import './MyOrders.css';

const TABS = ['All', 'Pending', 'Preparing', 'Ready for Pickup', 'Served', 'Expired'];

const MOCK_ORDERS = [];

const STATUS_CONFIG = {
  Pending:          { label: 'Pending Payment', color: '#f59e0b' },
  Preparing:        { label: 'Preparing',        color: '#3b82f6' },
  'Ready for Pickup': { label: 'Ready for Pickup', color: '#8b5cf6' },
  Served:           { label: 'Served',           color: '#22c55e' },
  Expired:          { label: 'Expired',          color: '#ef4444' },
};

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === activeTab);

  return (
    <div className="my-orders-page section-pad">
      <div className="container">
        <h1 className="my-orders__title">Your orders</h1>

        {/* Tabs */}
        <div className="my-orders__tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`my-orders__tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="my-orders__list">
          {filtered.length === 0 ? (
            <div className="my-orders__empty">
              <p>No orders found.</p>
            </div>
          ) : (
            filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="order-card">
                  {/* Top row */}
                  <div className="order-card__top">
                    <div className="order-card__meta">
                      <span className="order-card__id">Order ID: <strong>{order.id}</strong></span>
                      <span className="order-card__date">Order date: <strong>{order.date}</strong></span>
                    </div>
                    <button className="order-card__view-btn">View full order</button>
                  </div>

                  <div className="order-card__divider" />

                  {/* Bottom row */}
                  <div className="order-card__body">
                    <div className="order-card__col">
                      <p className="order-card__label">Items ordered:</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="order-card__item">{item}</p>
                      ))}
                    </div>
                    <div className="order-card__col">
                      <p className="order-card__label">Total amount:</p>
                      <p className="order-card__total">{order.total}</p>
                    </div>
                    <div className="order-card__col order-card__col--note">
                      <p className="order-card__label">Note:</p>
                      <p className="order-card__note">{order.note}</p>
                    </div>
                    <div className="order-card__status-wrap">
                      <span
                        className="order-card__status"
                        style={{ background: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      {order.expiresIn && (
                        <p className="order-card__expires">Expires in {order.expiresIn}.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import './Menu.css';

/* ─── Data ─────────────────────────────────────── */
const CATEGORIES = [
  { id: 'coffee',   label: 'Coffee',   icon: '/coffee-icon.png'  },
  { id: 'milktea',  label: 'Milktea',  icon: '/milktea-icon.png' },
  { id: 'soda',     label: 'Soda',     icon: '/soda-icon.png'    },
  { id: 'mocktail', label: 'Mocktail', icon: '/mocktail.png'     },
  { id: 'sides',    label: 'Sides',    icon: '/sides-icon.png'   },
];

const COFFEE_FILTERS = ['All', 'w/ Milk', 'Black'];

const makeCoffeeItems = (n) =>
  Array.from({ length: n }, (_, i) => ({
    id:    `coffee-${i + 1}`,
    name:  'Cappuccino',
    price: 75,
    img:   '/cappuccino_cup.png',
    type:  i % 3 === 0 ? 'Black' : 'w/ Milk',
  }));

const MENU_DATA = {
  coffee:   makeCoffeeItems(15),
  milktea:  makeCoffeeItems(10).map((i, idx) => ({ ...i, id: `milktea-${idx+1}`,  name: 'Taro Milktea',   price: 80, type: 'All' })),
  soda:     makeCoffeeItems(8).map((i, idx)  => ({ ...i, id: `soda-${idx+1}`,     name: 'Citrus Soda',    price: 65, type: 'All' })),
  mocktail: makeCoffeeItems(6).map((i, idx)  => ({ ...i, id: `mocktail-${idx+1}`, name: 'Virgin Mojito',  price: 90, type: 'All' })),
  sides:    makeCoffeeItems(8).map((i, idx)  => ({ ...i, id: `sides-${idx+1}`,    name: 'French Fries',   price: 55, type: 'All' })),
};

const fmt = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

/* ─── Edit icon ─────────────────────────────────── */
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

/* ─── Guest Sign In Modal (via Portal) ──────────── */
function GuestSignInModal({ item, onClose, onLogin, onSignUp }) {
  return createPortal(
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal guest-signin-modal" onClick={e => e.stopPropagation()}>
        <button className="item-modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="guest-signin-modal__img-wrap">
          <img src={item.img} alt={item.name} className="item-modal__img" />
        </div>

        <div className="guest-signin-modal__body">
          <div className="guest-signin-modal__lock">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="guest-signin-modal__title">Sign in to order</h2>
          <p className="guest-signin-modal__desc">
            Create an account or log in to add <strong>{item.name}</strong> to your cart and start ordering.
          </p>

          <div className="guest-signin-modal__actions">
            <button className="guest-signin-modal__btn guest-signin-modal__btn--primary" onClick={onLogin}>
              Log in
            </button>
            <button className="guest-signin-modal__btn guest-signin-modal__btn--outline" onClick={onSignUp}>
              Create an account
            </button>
          </div>

          <p className="guest-signin-modal__footer-text">
            Browse the menu freely — sign in when you're ready!
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Item Detail Modal (via Portal) ───────────── */
function ItemModal({ item, onClose, onAddToCart }) {
  const [qty,  setQty]  = useState(1);
  const [note, setNote] = useState('');

  function handleAdd() {
    onAddToCart({ ...item, qty, note });
    onClose();
  }

  return createPortal(
    <div className="item-modal-overlay" onClick={onClose}>
      <div className="item-modal" onClick={e => e.stopPropagation()}>
        <button className="item-modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="item-modal__img-wrap">
          <img src={item.img} alt={item.name} className="item-modal__img" />
        </div>

        <div className="item-modal__body">
          <h2 className="item-modal__name">{item.name}</h2>
          <p className="item-modal__price">{fmt(item.price)}</p>
          <p className="item-modal__desc">A perfectly crafted cup made with care — just how you like it.</p>

          {/* Quantity */}
          <div className="item-modal__qty-row">
            <span className="item-modal__label">Quantity</span>
            <div className="item-modal__qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="item-modal__qty-btn">−</button>
              <span className="item-modal__qty-val">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="item-modal__qty-btn">+</button>
            </div>
          </div>

          {/* Note */}
          <div className="item-modal__note-wrap">
            <label className="item-modal__label" htmlFor="item-note">
              Add a note <span>(optional)</span>
            </label>
            <textarea
              id="item-note"
              className="item-modal__note"
              placeholder="e.g. less sugar, extra ice…"
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="item-modal__footer">
            <span className="item-modal__subtotal">{fmt(item.price * qty)}</span>
            <button className="item-modal__add-btn" onClick={handleAdd}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Checkout Confirm Modal (via Portal) ───────── */
function CheckoutModal({ cartItems, onConfirm, onCancel }) {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const [orderNote, setOrderNote] = useState('');

  return createPortal(
    <div className="item-modal-overlay" onClick={onCancel}>
      <div className="item-modal checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="item-modal__close" onClick={onCancel} aria-label="Close">✕</button>

        <div className="checkout-modal__header">
          <h2 className="item-modal__name">Confirm your order</h2>
          <p className="item-modal__desc">Review your items before placing the order.</p>
        </div>

        <div className="checkout-modal__items">
          {cartItems.map(item => (
            <div key={item.cartKey} className="checkout-row">
              <img src={item.img} alt={item.name} className="checkout-row__img" />
              <div className="checkout-row__info">
                <p className="checkout-row__name">{item.qty}× {item.name}</p>
                {item.note && <p className="checkout-row__note">{item.note}</p>}
              </div>
              <p className="checkout-row__price">{fmt(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        <div className="checkout-modal__note-wrap">
          <label className="item-modal__label" htmlFor="order-note">
            Order note <span>(optional)</span>
          </label>
          <textarea
            id="order-note"
            className="item-modal__note"
            placeholder="e.g. Please include extra napkins…"
            rows={2}
            value={orderNote}
            onChange={e => setOrderNote(e.target.value)}
          />
        </div>

        <div className="checkout-modal__footer">
          <div className="cart-panel__total-row cart-panel__total-row--bold" style={{ marginBottom: 12 }}>
            <span>Total:</span><span>{fmt(subtotal)}</span>
          </div>
          <button className="item-modal__add-btn" onClick={() => onConfirm(orderNote)}>
            Place order
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Cart Panel ────────────────────────────────── */
function CartPanel({ cartItems, onInc, onDec, onCheckout }) {
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.qty, 0), [cartItems]);

  return (
    <aside className="cart-panel">
      <div className="cart-panel__header">
        <h3 className="cart-panel__title">Your cart</h3>
        <button className="cart-panel__edit" aria-label="Edit cart"><EditIcon /></button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-panel__empty">
          <p>Your cart is empty.</p>
          <p>Add items from the menu!</p>
        </div>
      ) : (
        <div className="cart-panel__items">
          {cartItems.map(item => (
            <div key={item.cartKey} className="cart-row">
              <img src={item.img} alt={item.name} className="cart-row__img" />
              <div className="cart-row__info">
                <p className="cart-row__name">{item.name}</p>
                <p className="cart-row__price">{fmt(item.price)}</p>
                {item.note && <p className="cart-row__note">{item.note}</p>}
              </div>
              <div className="cart-row__qty">
                <button className="cart-row__btn" onClick={() => onDec(item.cartKey)}>−</button>
                <span>{item.qty}</span>
                <button className="cart-row__btn" onClick={() => onInc(item.cartKey)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-panel__footer">
          <div className="cart-panel__totals">
            <div className="cart-panel__total-row">
              <span>Subtotal:</span><span>{fmt(subtotal)}</span>
            </div>
            <div className="cart-panel__total-row cart-panel__total-row--bold">
              <span>Total:</span><span>{fmt(subtotal)}</span>
            </div>
          </div>
          <button className="cart-panel__checkout-btn" onClick={onCheckout}>
            Proceed to check out
          </button>
        </div>
      )}
    </aside>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────── */
export default function Menu() {
  const { user }               = useAuth();
  const { placeOrder }         = useOrders();
  const navigate               = useNavigate();

  const [activeCategory,     setActiveCategory]     = useState('coffee');
  const [activeCoffeeFilter, setActiveCoffeeFilter] = useState('All');
  const [selectedItem,       setSelectedItem]       = useState(null);
  const [showCheckout,       setShowCheckout]       = useState(false);
  const [cartItems,          setCartItems]          = useState([]);
  const [guestItem,          setGuestItem]          = useState(null);

  const items = MENU_DATA[activeCategory] ?? [];
  const filtered =
    activeCategory === 'coffee' && activeCoffeeFilter !== 'All'
      ? items.filter(i => i.type === activeCoffeeFilter)
      : items;

  const sectionLabel =
    activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  /* ── Card click handler ── */
  function handleItemClick(item) {
    if (user) {
      setSelectedItem(item);
    } else {
      setGuestItem(item);
    }
  }

  /* ── Cart handlers ── */
  function addToCart({ qty, note, ...item }) {
    setCartItems(prev => {
      const cartKey = `${item.id}-${Date.now()}`;
      return [...prev, { ...item, qty, note, cartKey }];
    });
  }

  function incQty(cartKey) {
    setCartItems(prev => prev.map(i => i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i));
  }

  function decQty(cartKey) {
    setCartItems(prev =>
      prev.map(i => i.cartKey === cartKey ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0)
    );
  }

  /* ── Checkout ── */
  function handleConfirmOrder(orderNote) {
    placeOrder(cartItems, orderNote);
    setCartItems([]);
    setShowCheckout(false);
    navigate('/my-orders');
  }

  return (
    <main className="menu-page">
      {/* Hero */}
      <section className="menu-page__hero">
        <div className="menu-page__hero-bg" />
        <div className="container menu-page__hero-inner">
          <h1 className="menu-page__hero-title">Our Menu</h1>
          <p className="menu-page__hero-sub">Handcrafted for your every mood</p>
        </div>
      </section>

      {/* Body */}
      <div className={`container menu-page__body${user ? ' menu-page__body--with-cart' : ''}`}>

        {/* Left */}
        <div className="menu-page__left">
          <section className="menu-categories">
            <h2 className="menu-categories__heading">Categories</h2>
            <div className="menu-categories__list">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  id={`category-${cat.id}`}
                  className={`menu-cat-btn${activeCategory === cat.id ? ' menu-cat-btn--active' : ''}`}
                  onClick={() => { setActiveCategory(cat.id); setActiveCoffeeFilter('All'); }}
                >
                  <img src={cat.icon} alt={cat.label} className="menu-cat-btn__icon" />
                  <span className="menu-cat-btn__label">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="menu-grid-section">
            <div className="menu-grid-section__header">
              <h2 className="menu-grid-section__title">
                {activeCategory === 'coffee' ? 'Hot coffee' : sectionLabel}
              </h2>
              {activeCategory === 'coffee' && (
                <div className="menu-filter-btns">
                  {COFFEE_FILTERS.map(f => (
                    <button
                      key={f}
                      id={`filter-${f.toLowerCase().replace(' ', '-')}`}
                      className={`menu-filter-btn${activeCoffeeFilter === f ? ' menu-filter-btn--active' : ''}`}
                      onClick={() => setActiveCoffeeFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`menu-grid${user ? ' menu-grid--with-cart' : ''}`}>
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="menu-item-card"
                  id={`item-${activeCategory}-${item.id}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="menu-item-card__img-wrap">
                    <img src={item.img} alt={item.name} className="menu-item-card__img" />
                  </div>
                  <div className="menu-item-card__info">
                    <span className="menu-item-card__name">{item.name}</span>
                    <span className="menu-item-card__price">PHP {item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Cart */}
        {user && (
          <CartPanel
            cartItems={cartItems}
            onInc={incQty}
            onDec={decQty}
            onCheckout={() => setShowCheckout(true)}
          />
        )}
      </div>

      {/* Guest sign-in modal — portal to body */}
      {guestItem && (
        <GuestSignInModal
          item={guestItem}
          onClose={() => setGuestItem(null)}
          onLogin={() => navigate('/login')}
          onSignUp={() => navigate('/login')}
        />
      )}

      {/* Item modal — portal to body */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Checkout confirm modal — portal to body */}
      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </main>
  );
}

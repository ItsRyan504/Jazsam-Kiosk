import { useState } from 'react';
import './Menu.css';

const CATEGORIES = [
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'milktea', label: 'Milktea', icon: '🧋' },
  { id: 'soda', label: 'Soda', icon: '🥤' },
  { id: 'mocktail', label: 'Mocktail', icon: '🍹' },
  { id: 'sides', label: 'Sides', icon: '🍟' },
];

const COFFEE_FILTERS = ['All', 'w/ Milk', 'Black'];

// Build menu items dynamically
const makeCoffeeItems = (n) =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: 'Cappuccino',
    price: 'PHP 75.00',
    img: '/cappuccino_cup.png',
    type: i % 3 === 0 ? 'Black' : 'w/ Milk',
  }));

const MENU_DATA = {
  coffee: makeCoffeeItems(15),
  milktea: makeCoffeeItems(10).map(i => ({ ...i, name: 'Taro Milktea', price: 'PHP 80.00', type: 'All' })),
  soda: makeCoffeeItems(8).map(i => ({ ...i, name: 'Citrus Soda', price: 'PHP 65.00', type: 'All' })),
  mocktail: makeCoffeeItems(6).map(i => ({ ...i, name: 'Virgin Mojito', price: 'PHP 90.00', type: 'All' })),
  sides: makeCoffeeItems(8).map(i => ({ ...i, name: 'French Fries', price: 'PHP 55.00', type: 'All' })),
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [activeCoffeeFilter, setActiveCoffeeFilter] = useState('All');

  const items = MENU_DATA[activeCategory] ?? [];
  const filtered =
    activeCategory === 'coffee' && activeCoffeeFilter !== 'All'
      ? items.filter(i => i.type === activeCoffeeFilter)
      : items;

  const sectionLabel =
    activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return (
    <main className="menu-page">
      {/* Hero Banner */}
      <section className="menu-page__hero">
        <div className="menu-page__hero-bg" />
        <div className="container menu-page__hero-inner">
          <h1 className="menu-page__hero-title">Our Menu</h1>
          <p className="menu-page__hero-sub">Handcrafted for your every mood</p>
        </div>
      </section>

      <div className="container menu-page__body">
        {/* Categories */}
        <section className="menu-categories">
          <h2 className="menu-categories__heading">Categories</h2>
          <div className="menu-categories__list">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                id={`category-${cat.id}`}
                className={`menu-cat-btn${activeCategory === cat.id ? ' menu-cat-btn--active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveCoffeeFilter('All');
                }}
              >
                <span className="menu-cat-btn__icon">{cat.icon}</span>
                <span className="menu-cat-btn__label">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Items Grid */}
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

          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className="menu-item-card" id={`item-${activeCategory}-${item.id}`}>
                <div className="menu-item-card__img-wrap">
                  <img src={item.img} alt={item.name} className="menu-item-card__img" />
                </div>
                <div className="menu-item-card__info">
                  <span className="menu-item-card__name">{item.name}</span>
                  <span className="menu-item-card__price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

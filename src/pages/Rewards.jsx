import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import './Rewards.css';

/* ─── Tier config ───────────────────────────── */
const TIERS = [
  { name: 'Bronze', min: 0,    max: 499,  color: '#cd7f32', gradient: 'linear-gradient(135deg, #cd7f32, #a0603a)', icon: '🥉' },
  { name: 'Silver', min: 500,  max: 1499, color: '#a8a8a8', gradient: 'linear-gradient(135deg, #b0b0b0, #8a8a8a)', icon: '🥈' },
  { name: 'Gold',   min: 1500, max: 9999, color: '#d4a853', gradient: 'linear-gradient(135deg, #d4a853, #f0c87a)', icon: '🥇' },
];

/* ─── Reward catalog ────────────────────────── */
const REWARDS = [
  { id: 'r1', name: 'Free Upsize',            desc: 'Upgrade any drink to the next size',          points: 50,  icon: '📏', category: 'Drinks'  },
  { id: 'r2', name: 'Free Add-on',            desc: 'Add extra toppings at no cost',                points: 75,  icon: '🧋', category: 'Drinks'  },
  { id: 'r3', name: '₱20 Off Any Drink',      desc: 'Discount on your next beverage order',         points: 100, icon: '☕', category: 'Drinks'  },
  { id: 'r4', name: 'Free French Fries',      desc: 'A side of crispy fries on the house',          points: 120, icon: '🍟', category: 'Sides'   },
  { id: 'r5', name: 'Buy 1 Get 1 Coffee',     desc: 'Get a second coffee free with your order',     points: 200, icon: '🎉', category: 'Drinks'  },
  { id: 'r6', name: '₱50 Off Any Order',      desc: 'Discount applied to your total bill',          points: 250, icon: '💰', category: 'Special' },
  { id: 'r7', name: 'Free Milktea (Any Size)', desc: 'Enjoy any milktea flavor for free',            points: 300, icon: '🥤', category: 'Drinks'  },
  { id: 'r8', name: 'Birthday Bonus Double Pts', desc: 'Earn 2x points for a full week',            points: 500, icon: '🎂', category: 'Special' },
];

const FILTER_CATEGORIES = ['All', 'Drinks', 'Sides', 'Special'];

/* ─── How-It-Works steps ────────────────────── */
const HOW_IT_WORKS = [
  { step: '01', title: 'Place an Order',  desc: 'Earn 1 point for every ₱10 you spend.' },
  { step: '02', title: 'Collect Points',  desc: 'Watch your points grow with each visit.' },
  { step: '03', title: 'Redeem Rewards',  desc: 'Trade points for free drinks, discounts & more.' },
];

/* ─── Confetti animation component ──────────── */
function ConfettiOverlay({ onDone }) {
  return (
    <div className="confetti-overlay" onAnimationEnd={onDone}>
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="confetti-particle"
          style={{
            '--x': `${Math.random() * 100}%`,
            '--delay': `${Math.random() * 0.5}s`,
            '--color': ['#d4a853','#cd7f32','#e53935','#22c55e','#3b82f6','#f59e0b'][i % 6],
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN REWARDS PAGE
   ════════════════════════════════════════════ */
export default function Rewards() {
  const { user, redeemPoints } = useAuth();
  const { orders }             = useOrders();
  const navigate               = useNavigate();

  const [filterCat, setFilterCat] = useState('All');
  const [redeemed,  setRedeemed]  = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const points  = user?.points || 0;
  const tier    = TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  const nextTier = TIERS.find(t => t.min > points);
  const progress = nextTier
    ? ((points - tier.min) / (nextTier.min - tier.min)) * 100
    : 100;

  const filteredRewards = filterCat === 'All'
    ? REWARDS
    : REWARDS.filter(r => r.category === filterCat);

  function handleRedeem(reward) {
    if (!user || points < reward.points) return;
    const success = redeemPoints(reward.points);
    if (success) {
      setRedeemed(reward);
      setShowConfetti(true);
    }
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="rewards-page">
        <section className="rewards-hero">
          <div className="rewards-hero__bg" />
          <div className="container rewards-hero__inner">
            <h1 className="rewards-hero__title">JazSam Rewards</h1>
            <p className="rewards-hero__sub">Earn points, unlock perks, enjoy every sip even more.</p>
          </div>
        </section>

        <div className="container rewards-body">
          {/* How it works */}
          <section className="rewards-section">
            <h2 className="rewards-section__title">How It Works</h2>
            <div className="how-it-works-grid">
              {HOW_IT_WORKS.map(item => (
                <div key={item.step} className="how-card">
                  <span className="how-card__step">{item.step}</span>
                  <h3 className="how-card__title">{item.title}</h3>
                  <p className="how-card__desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rewards-cta">
            <div className="rewards-cta__card">
              <div className="rewards-cta__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3 className="rewards-cta__title">Start earning rewards today</h3>
              <p className="rewards-cta__desc">Sign in or create an account to begin collecting points with every order.</p>
              <div className="rewards-cta__actions">
                <button className="rewards-cta__btn rewards-cta__btn--primary" onClick={() => navigate('/login')}>
                  Log in
                </button>
                <button className="rewards-cta__btn rewards-cta__btn--outline" onClick={() => navigate('/login')}>
                  Create account
                </button>
              </div>
            </div>
          </section>

          {/* Preview grid */}
          <section className="rewards-section">
            <h2 className="rewards-section__title">Rewards You Can Unlock</h2>
            <div className="rewards-catalog-grid">
              {REWARDS.slice(0, 4).map(reward => (
                <div key={reward.id} className="reward-card reward-card--locked">
                  <div className="reward-card__icon-wrap">
                    <span className="reward-card__icon">{reward.icon}</span>
                  </div>
                  <div className="reward-card__info">
                    <h4 className="reward-card__name">{reward.name}</h4>
                    <p className="reward-card__desc">{reward.desc}</p>
                    <span className="reward-card__points">{reward.points} pts</span>
                  </div>
                  <div className="reward-card__lock-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ── Logged in ── */
  return (
    <div className="rewards-page">
      {showConfetti && <ConfettiOverlay onDone={() => setShowConfetti(false)} />}

      {/* Hero */}
      <section className="rewards-hero">
        <div className="rewards-hero__bg" />
        <div className="container rewards-hero__inner">
          <h1 className="rewards-hero__title">JazSam Rewards</h1>
          <p className="rewards-hero__sub">Earn points, unlock perks, enjoy every sip even more.</p>
        </div>
      </section>

      <div className="container rewards-body">

        {/* Points overview card */}
        <section className="rewards-overview">
          <div className="rewards-overview__card" style={{ background: tier.gradient }}>
            <div className="rewards-overview__left">
              <span className="rewards-overview__tier-icon">{tier.icon}</span>
              <div>
                <p className="rewards-overview__tier-label">{tier.name} Member</p>
                <p className="rewards-overview__points">{points.toLocaleString()}</p>
                <p className="rewards-overview__points-label">Total Points</p>
              </div>
            </div>
            <div className="rewards-overview__right">
              <p className="rewards-overview__orders-count">{orders.length}</p>
              <p className="rewards-overview__orders-label">Orders</p>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier ? (
            <div className="rewards-tier-progress">
              <div className="rewards-tier-progress__labels">
                <span>{tier.name}</span>
                <span>{nextTier.min - points} pts to {nextTier.name}</span>
              </div>
              <div className="rewards-tier-progress__bar">
                <div
                  className="rewards-tier-progress__fill"
                  style={{ width: `${Math.min(progress, 100)}%`, background: tier.gradient }}
                />
              </div>
            </div>
          ) : (
            <div className="rewards-tier-progress">
              <p className="rewards-tier-progress__max">🎉 You've reached the highest tier!</p>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="rewards-section">
          <h2 className="rewards-section__title">How It Works</h2>
          <div className="how-it-works-grid">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="how-card">
                <span className="how-card__step">{item.step}</span>
                <h3 className="how-card__title">{item.title}</h3>
                <p className="how-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rewards catalog */}
        <section className="rewards-section">
          <div className="rewards-section__header">
            <h2 className="rewards-section__title">Redeem Rewards</h2>
            <div className="rewards-filter-btns">
              {FILTER_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`rewards-filter-btn${filterCat === cat ? ' rewards-filter-btn--active' : ''}`}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="rewards-catalog-grid">
            {filteredRewards.map(reward => {
              const canRedeem = points >= reward.points;
              return (
                <div
                  key={reward.id}
                  className={`reward-card${canRedeem ? '' : ' reward-card--disabled'}`}
                >
                  <div className="reward-card__icon-wrap">
                    <span className="reward-card__icon">{reward.icon}</span>
                  </div>
                  <div className="reward-card__info">
                    <h4 className="reward-card__name">{reward.name}</h4>
                    <p className="reward-card__desc">{reward.desc}</p>
                    <span className="reward-card__points">{reward.points} pts</span>
                  </div>
                  <button
                    className={`reward-card__btn${canRedeem ? '' : ' reward-card__btn--disabled'}`}
                    onClick={() => canRedeem && handleRedeem(reward)}
                    disabled={!canRedeem}
                  >
                    {canRedeem ? 'Redeem' : 'Not enough'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick links */}
        <section className="rewards-quick-links">
          <button className="rewards-quick-link" onClick={() => navigate('/menu')}>
            <span className="rewards-quick-link__icon">☕</span>
            <span>Order now & earn points</span>
            <span className="rewards-quick-link__arrow">→</span>
          </button>
          <button className="rewards-quick-link" onClick={() => navigate('/my-orders')}>
            <span className="rewards-quick-link__icon">📋</span>
            <span>View my orders</span>
            <span className="rewards-quick-link__arrow">→</span>
          </button>
        </section>
      </div>

      {/* Redemption success modal */}
      {redeemed && (
        <div className="reward-success-overlay" onClick={() => setRedeemed(null)}>
          <div className="reward-success-modal" onClick={e => e.stopPropagation()}>
            <div className="reward-success-modal__icon">{redeemed.icon}</div>
            <h3 className="reward-success-modal__title">Reward Redeemed!</h3>
            <p className="reward-success-modal__desc">
              You've successfully redeemed <strong>{redeemed.name}</strong> for {redeemed.points} points.
            </p>
            <p className="reward-success-modal__balance">
              Remaining balance: <strong>{(user?.points || 0).toLocaleString()} pts</strong>
            </p>
            <button className="reward-success-modal__btn" onClick={() => setRedeemed(null)}>
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

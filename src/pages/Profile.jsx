import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import './Profile.css';

/* ─── Avatar with initials ──────────────────── */
function Avatar({ name, size = 80 }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <div className="profile-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

/* ─── Stat card ─────────────────────────────── */
function StatCard({ label, value, accent }) {
  return (
    <div className="profile-stat">
      <span className="profile-stat__value" style={accent ? { color: accent } : {}}>{value}</span>
      <span className="profile-stat__label">{label}</span>
    </div>
  );
}

/* ─── Field row ─────────────────────────────── */
function FieldRow({ id, label, type = 'text', value, onChange, placeholder, readOnly }) {
  return (
    <div className="profile-field">
      <label className="profile-field__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className={`profile-field__input${readOnly ? ' profile-field__input--readonly' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────── */
export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { orders }                   = useOrders();
  const navigate                     = useNavigate();

  /* ── Form state (seeded from user context) ── */
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [saved,    setSaved]    = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  /* ── Order stats from context ── */
  const totalOrders   = orders.length;
  const totalSpent    = orders.reduce((s, o) => s + (typeof o.total === 'number' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  function handleChange(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setSaved(false);
    };
  }

  function handleSave(e) {
    e.preventDefault();
    updateUser(form);
    setSaved(true);
    setEditing(false);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  /* redirect to login if not logged in */
  if (!user) {
    return (
      <div className="profile-page section-pad">
        <div className="container profile-not-logged">
          <p>You need to <a href="/login">log in</a> to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* ── Hero banner ── */}
      <div className="profile-hero">
        <div className="profile-hero__bg" />
        <div className="container profile-hero__content">
          <Avatar name={form.name} size={88} />
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{form.name || 'Your Name'}</h1>
            <p className="profile-hero__email">{form.email}</p>
          </div>
        </div>
      </div>

      <div className="container profile-body">

        {/* ── Stats row ── */}
        <div className="profile-stats">
          <StatCard label="Total orders"  value={totalOrders}  />
          <StatCard
            label="Total spent"
            value={`₱${totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
            accent="var(--color-brown-light)"
          />
          <StatCard label="Pending" value={pendingOrders} accent={pendingOrders > 0 ? '#f59e0b' : undefined} />
        </div>

        {/* ── Profile info card ── */}
        <div className="profile-card">
          <div className="profile-card__header">
            <div>
              <h2 className="profile-card__title">Personal information</h2>
              <p className="profile-card__sub">Manage your account details</p>
            </div>
            {!editing && (
              <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            )}
          </div>

          <form className="profile-form" onSubmit={handleSave} noValidate>
            <div className="profile-form__grid">
              <FieldRow
                id="profile-name"
                label="Full name"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your full name"
                readOnly={!editing}
              />
              <FieldRow
                id="profile-email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                readOnly={!editing}
              />
              <FieldRow
                id="profile-phone"
                label="Contact number"
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+63 9XX XXX XXXX"
                readOnly={!editing}
              />
            </div>

            {editing && (
              <div className="profile-form__actions">
                <button
                  type="button"
                  className="profile-btn profile-btn--outline"
                  onClick={() => { setEditing(false); setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }); }}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-btn profile-btn--primary">
                  Save changes
                </button>
              </div>
            )}

            {saved && !editing && (
              <p className="profile-saved-msg">✓ Changes saved successfully.</p>
            )}
          </form>
        </div>

        {/* ── Quick links ── */}
        <div className="profile-card profile-quick-links">
          <h2 className="profile-card__title" style={{ marginBottom: 16 }}>Quick links</h2>
          <div className="profile-links-grid">
            <button className="profile-link-card" onClick={() => navigate('/my-orders')}>
              <span className="profile-link-card__icon">📋</span>
              <span className="profile-link-card__label">My orders</span>
              <span className="profile-link-card__arrow">→</span>
            </button>
            <button className="profile-link-card" onClick={() => navigate('/rewards')}>
              <span className="profile-link-card__icon">⭐</span>
              <span className="profile-link-card__label">Rewards</span>
              <span className="profile-link-card__arrow">→</span>
            </button>
            <button className="profile-link-card" onClick={() => navigate('/menu')}>
              <span className="profile-link-card__icon">☕</span>
              <span className="profile-link-card__label">Order now</span>
              <span className="profile-link-card__arrow">→</span>
            </button>
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div className="profile-card profile-danger-zone">
          <button
            className="profile-danger-toggle"
            onClick={() => setShowDanger(v => !v)}
          >
            <span>Account actions</span>
            <span className={`profile-danger-toggle__arrow${showDanger ? ' open' : ''}`}>▾</span>
          </button>

          {showDanger && (
            <div className="profile-danger-body">
              <p className="profile-danger-desc">
                Logging out will end your current session. You can log back in anytime.
              </p>
              <button className="profile-btn profile-btn--danger" onClick={handleLogout}>
                Log out of this account
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

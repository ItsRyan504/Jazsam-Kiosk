import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const FEATURED = [
  {
    id: 1,
    name: 'Spanish Latte',
    desc: 'A light, buttery taste with delicate floral notes and a golden, crisp undertone — silky smooth and rich, satisfying same in everyday.',
    img: '/spanish_latte.png',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Spanish Latte',
    desc: 'A light, buttery taste with delicate floral notes and a golden, crisp undertone — silky smooth and rich.',
    img: '/spanish_latte.png',
    tag: null,
  },
  {
    id: 3,
    name: 'Spanish Latte',
    desc: 'A light, buttery taste with delicate floral notes and a golden, crisp undertone — silky smooth and rich.',
    img: '/spanish_latte.png',
    tag: null,
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    text: 'The coffee is consistently good, the place feels warm and inviting, perfect for both quiet moments and catching up with friends. You can really feel the care they put into every cup.',
    name: 'Sawako Kuronuma',
    role: 'Verified Customer',
    img: '/customer_avatar.png',
    stars: 5,
  },
  {
    id: 2,
    text: 'The coffee is consistently good, the place feels warm and inviting, perfect for both quiet moments and catching up with friends. You can really feel the care they put into every cup.',
    name: 'Sawako Kuronuma',
    role: 'Verified Customer',
    img: '/customer_avatar.png',
    stars: 5,
  },
  {
    id: 3,
    text: 'The coffee is consistently good, the place feels warm and inviting, perfect for both quiet moments and catching up with friends. You can really feel the care they put into every cup.',
    name: 'Sawako Kuronuma',
    role: 'Verified Customer',
    img: '/customer_avatar.png',
    stars: 5,
  },
];

const TABS = ['Coffee', 'Milkteas', 'Specials'];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Coffee');

  return (
    <main className="home">
      {/* ────────── HERO ────────── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="container hero__inner">
          <div className="hero__text">
            <div className="hero__eyebrow">
              <span className="hero__brand-pill">
                <span className="hero__brand-dot" />
                Jazsam Coffee
              </span>
            </div>
            <h1 className="hero__headline">
              Where every sip<br />tells a tale.
            </h1>
            <p className="hero__sub">
              Handcrafted coffee made with love, served in the heart of Legazpi City.
            </p>
            <div className="hero__ctas">
              <Link to="/menu" className="btn-primary hero__cta-main">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
                View Menu
              </Link>
              <Link to="/about" className="btn-outline hero__cta-sec">Our Story</Link>
            </div>
          </div>
          <div className="hero__image-wrap">
            <div className="hero__image-glow" />
            <img src="/hero_coffee.png" alt="Jazsam Coffee hero drink" className="hero__image" />
          </div>
        </div>
        <div className="hero__wave">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="#f8f6f2"/>
          </svg>
        </div>
      </section>

      {/* ────────── FEATURED ────────── */}
      <section className="featured section-pad">
        <div className="container">
          <div className="featured__header">
            <div>
              <p className="section-eyebrow">Featured</p>
              <h2 className="section-title">Discover our top picks—<br />customer favorites brewed to perfection and loved in every sip.</h2>
            </div>
            <Link to="/menu" className="btn-outline">View Full Menu →</Link>
          </div>

          {/* Tab bar */}
          <div className="featured__tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`featured__tab${activeTab === tab ? ' featured__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="featured__cards">
            {FEATURED.map((item, i) => (
              <div
                key={item.id}
                className={`featured__card${i === 1 ? ' featured__card--center' : ''}`}
              >
                {item.tag && <span className="featured__card-tag">{item.tag}</span>}
                <div className="featured__card-img-wrap">
                  <img src={item.img} alt={item.name} className="featured__card-img" />
                </div>
                <div className="featured__card-body">
                  <h3 className="featured__card-name">{item.name}</h3>
                  <p className="featured__card-desc">{item.desc}</p>
                  {i === 1 && (
                    <button className="btn-primary featured__card-btn">Add to order</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── TESTIMONIALS ────────── */}
      <section className="testimonials section-pad">
        <div className="container">
          <div className="testimonials__top">
            <div className="testimonials__quote-wrap">
              <div className="testimonials__big-quote">"</div>
              <h2 className="testimonials__headline">
                Read words<br />from our<br />customers.
              </h2>
            </div>
            <div className="testimonials__cards">
              {TESTIMONIALS.map(t => (
                <div key={t.id} className="testimonial__card">
                  <p className="testimonial__text">{t.text}</p>
                  <div className="testimonial__footer">
                    <img src={t.img} alt={t.name} className="testimonial__avatar" />
                    <div>
                      <div className="testimonial__name">{t.name}</div>
                      <div className="testimonial__role">{t.role}</div>
                    </div>
                    <div className="star-row testimonial__stars" style={{ marginLeft: 'auto' }}>
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="testimonials__banner">
            <p className="testimonials__banner-text">
              From real customers,<br />
              <strong>for real coffee lovers.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ────────── MAP ────────── */}
      <section className="map-section section-pad">
        <div className="container">
          <div className="map-section__inner">
            <div className="map-section__info">
              <h2 className="map-section__title">Find us on the Map</h2>
              <p className="map-section__sub">
                Drop by for pickups and in-person inquiries.
              </p>
              <div className="map-section__details">
                <div className="map-detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <strong>Address:</strong><br />
                    4PLJ+32W, Old Albay District,<br /> Legazpi City, Albay
                  </div>
                </div>
                <div className="map-detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div>
                    <strong>Hours:</strong><br />
                    Mon-Sat: 8:00 AM – 7:00 PM
                  </div>
                </div>
                <div className="map-detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  <div>
                    <strong>Landmark:</strong><br />
                    Near Peñaranda Park
                  </div>
                </div>
              </div>
              <div className="map-section__btns">
                <a
                  href="https://maps.google.com/?q=Jazsam+Coffee+Legazpi+City+Albay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary map-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Get Directions
                </a>
                <button
                  className="btn-outline map-btn"
                  onClick={() => navigator.clipboard.writeText('4PLJ+32W, Old Albay District, Legazpi City, Albay')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy
                </button>
              </div>
            </div>

            <div className="map-section__map-wrap">
              {/* Google Maps Embed placeholder – you'll integrate the real API later */}
              <iframe
                className="map-section__map"
                title="Jazsam Coffee location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3!2d123.7541!3d13.1391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLegazpi+City%2C+Albay!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── REVIEWS PLATFORMS ────────── */}
      <section className="reviews-platforms section-pad">
        <div className="container">
          <p className="reviews-platforms__label">Leave a review on the following platforms:</p>
          <div className="reviews-platforms__cards">
            {/* Google Maps */}
            <a href="#" className="platform-card" target="_blank" rel="noopener noreferrer">
              <div className="platform-card__logo platform-card__logo--google">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="platform-card__info">
                <strong>Jazsam Coffee</strong>
                <span>4PLJ+32W, Old Albay District, Legazpi City</span>
                <div className="platform-card__action">Review on Google Maps</div>
              </div>
            </a>

            {/* Facebook */}
            <a href="#" className="platform-card" target="_blank" rel="noopener noreferrer">
              <div className="platform-card__logo platform-card__logo--fb">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="platform-card__info">
                <strong>Jazsam</strong>
                <span>4PLJ+32W, Old Albay District, Legazpi City</span>
                <div className="platform-card__action">Review on Facebook</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

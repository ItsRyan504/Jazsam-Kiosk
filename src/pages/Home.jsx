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
        {/* Coffee cup naturally embedded in bokeh background */}
        <div className="hero__bg-img" />
        {/* Very subtle overlay for text legibility */}
        <div className="hero__overlay" />

        {/* Centered text block */}
        <div className="hero__centered">
          <p className="hero__eyebrow-text">This is Jazsam Coffee</p>
          <h1 className="hero__headline">Where every sip tells a tale.</h1>
        </div>

        {/* Bottom-left social handle */}
        <div className="hero__social-handle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>@JazsamCoffee</span>
        </div>
      </section>

      {/* ────────── FEATURED ────────── */}
      <section className="featured section-pad">
        <div className="container">
          <div className="featured__header">
            <div>
              <p className="section-eyebrow">Featured</p>
              <p className="section-subtitle">Discover our top picks—customer favorites brewed to perfection and loved in every sip.</p>
            </div>
            <Link to="/menu" className="featured__view-link">View Full Menu →</Link>
          </div>

          {/* Cards – tabs now at the BOTTOM */}
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
                    <button className="btn-primary featured__card-btn">GET BREWING</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tab bar – BELOW the cards */}
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
                  href="https://maps.google.com/?q=4PRJ%2B32W+Old+Albay+District+Legazpi+City+Albay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary map-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Get Directions
                </a>
                <button
                  className="btn-outline map-btn"
                  onClick={() => navigator.clipboard.writeText('4PRJ+32W, Old Albay District, Legazpi City, Albay')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy
                </button>
              </div>
            </div>

            <div className="map-section__map-wrap">
              <iframe
                className="map-section__map"
                title="Jazsam Coffee location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Jazsam+Coffee+4PRJ%2B32W+Old+Albay+Legazpi+City+Albay&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── GOT THOUGHTS / REVIEWS ────────── */}
      <section className="reviews-section section-pad">
        <div className="container reviews-section__inner">
          {/* Left: CTA text */}
          <div className="reviews-section__left">
            <p className="reviews-section__got">Got thoughts?</p>
            <p className="reviews-section__headline"><strong>Help us improve.</strong></p>
            <p className="reviews-section__desc">
              Every review matters. Your feedback guides us in delivering better coffee and service.
            </p>
          </div>

          {/* Right: label + cards */}
          <div className="reviews-section__right">
            <p className="reviews-section__label">Leave a review on the following platforms:</p>
            <div className="reviews-section__cards">

              {/* Google Maps card */}
              <a
                href="https://search.google.com/local/writereview?placeid=ChIJLWMGb3GpqTMRqmKP8p6-3mA"
                className="rev-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Google Maps pin icon */}
                <div className="rev-card__icon rev-card__icon--maps">
                  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                    <circle cx="28" cy="28" r="28" fill="white"/>
                    <path d="M28 14C22.477 14 18 18.477 18 24c0 8.25 10 18 10 18s10-9.75 10-18c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="#EA4335"/>
                    <path d="M28 14C22.477 14 18 18.477 18 24c0 8.25 10 18 10 18s10-9.75 10-18c0-5.523-4.477-10-10-10z" fill="url(#maps_grad)"/>
                    <defs>
                      <linearGradient id="maps_grad" x1="18" y1="14" x2="38" y2="42" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4285F4"/>
                        <stop offset="0.3" stopColor="#34A853"/>
                        <stop offset="0.6" stopColor="#FBBC05"/>
                        <stop offset="1" stopColor="#EA4335"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="rev-card__body">
                  <div className="rev-card__name">Jazsam Coffee</div>
                  <div className="rev-card__address">4PLJ+32W, Old Albay District, Legazpi City, Albay</div>
                  <div className="rev-card__rating">
                    <div className="rev-card__stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= 3 ? '#FBBC05' : '#d0d0d0', fontSize: '0.9rem' }}>★</span>
                      ))}
                    </div>
                    <span className="rev-card__count">3.0 ★ (5)</span>
                  </div>
                  <button className="rev-card__btn rev-card__btn--maps">Rate us on Google Maps</button>
                </div>
              </a>

              {/* Facebook card */}
              <a
                href="https://www.facebook.com/jazsamcoffee"
                className="rev-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="rev-card__icon rev-card__icon--fb">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#1877F2"/>
                    <path d="M22.5 21h3l.5-3h-3.5v-1.5c0-.85.42-1.5 1.5-1.5H26v-2.5s-1.1-.5-2.5-.5c-2.6 0-4 1.6-4 4.1V18H17v3h2.5v7h3v-7z" fill="white"/>
                  </svg>
                </div>
                <div className="rev-card__body">
                  <div className="rev-card__name">Jazsam</div>
                  <div className="rev-card__followers">1.2k followers</div>
                  <div className="rev-card__address">4PLJ+32W, Old Albay District, Legazpi City, Albay</div>
                  <button className="rev-card__btn rev-card__btn--fb">Rate us on Facebook</button>
                </div>
              </a>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

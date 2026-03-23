import './Location.css';

export default function Location() {
  return (
    <main className="location-page">
      <div className="location-page__hero">
        <div className="container location-page__hero-inner">
          <h1 className="location-page__title">Find Us</h1>
          <p className="location-page__sub">We're located in the heart of Legazpi City, Albay.</p>
        </div>
      </div>

      <div className="container location-page__body section-pad">
        <div className="location-page__grid">
          <div className="location-page__info">
            <h2 className="location-page__info-title">Visit Jazsam Coffee</h2>
            <div className="location-detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <strong>Address</strong>
                <p>4PLJ+32W, Old Albay District, Legazpi City, Albay</p>
              </div>
            </div>
            <div className="location-detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div>
                <strong>Hours</strong>
                <p>Monday – Saturday: 8:00 AM to 7:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="location-detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <div>
                <strong>Landmark</strong>
                <p>Near Peñaranda Park, Old Albay District</p>
              </div>
            </div>

            <div className="location-page__btns">
              <a
                href="https://maps.google.com/?q=Jazsam+Coffee+Legazpi+City+Albay"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="location-page__map-wrap">
            <iframe
              className="location-page__map"
              title="Jazsam Coffee full map"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.3!2d123.7541!3d13.1391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLegazpi+City%2C+Albay!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

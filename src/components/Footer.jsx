import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__brand-name">
            <div className="footer__logo-icon">J</div>
            <span>Jazsam Coffee</span>
          </div>
          <p className="footer__tagline">Where every sip tells a tale.</p>
        </div>

        {/* Privacy */}
        <div className="footer__col">
          <h4 className="footer__col-heading">PRIVACY</h4>
          <ul className="footer__col-links">
            <li><Link to="#">Terms of use</Link></li>
            <li><Link to="#">Privacy policy</Link></li>
            <li><Link to="#">Cookies</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="footer__col">
          <h4 className="footer__col-heading">EXPLORE</h4>
          <ul className="footer__col-links">
            <li><Link to="/menu">Our menu</Link></li>
            <li><Link to="/location">Find our location</Link></li>
            <li><Link to="/menu">Place an order</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer__col">
          <h4 className="footer__col-heading">COMPANY</h4>
          <ul className="footer__col-links">
            <li><Link to="/about">About us</Link></li>
            <li><Link to="#">Careers</Link></li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div className="footer__col footer__col--contact">
          <h4 className="footer__col-heading">GET IN TOUCH</h4>
          <div className="footer__socials">
            {/* Facebook */}
            <a href="#" className="footer__social-icon" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="footer__social-icon" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.84a8.29 8.29 0 0 0 4.84 1.55V6.94a4.85 4.85 0 0 1-1.07-.25z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className="footer__social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
          </div>
          <div className="footer__contact-items">
            <div className="footer__contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>jazsamcoffee@gmail.com</span>
            </div>
            <div className="footer__contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>+639876543210</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© 2026 Jazsam Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

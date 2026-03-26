import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__brand-name">
            <div className="footer__logo-icon">
              <img src="/trademark.png" alt="Jazsam" className="footer__trademark-img" />
            </div>
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

      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© 2026 Jazsam Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

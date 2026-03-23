import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Location from './pages/Location';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/location" element={<Location />} />
        <Route path="/login" element={<LoginPlaceholder />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

function LoginPlaceholder() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      paddingTop: '64px',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '48px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
      }}>
        <div style={{
          width: '56px', height: '56px',
          background: '#1a1a1a', color: '#fff',
          borderRadius: '14px', fontSize: '1.4rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
        }}>J</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '8px' }}>
          Welcome back
        </h2>
        <p style={{ color: '#7a7472', fontSize: '0.9rem', marginBottom: '32px' }}>
          Login / Sign up page — coming soon!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            placeholder="Email address"
            style={{
              padding: '13px 16px', borderRadius: '10px',
              border: '1.5px solid #e0d9d0', fontSize: '0.9rem', outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              padding: '13px 16px', borderRadius: '10px',
              border: '1.5px solid #e0d9d0', fontSize: '0.9rem', outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button style={{
            padding: '14px', borderRadius: '10px',
            background: '#1a1a1a', color: '#fff',
            fontSize: '0.9rem', fontWeight: '600',
            cursor: 'pointer', border: 'none',
            fontFamily: 'Inter, sans-serif',
          }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

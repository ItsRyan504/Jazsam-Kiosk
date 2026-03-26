import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Location from './pages/Location';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <PageTransition>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/about"     element={<About />} />
            <Route path="/menu"      element={<Menu />} />
            <Route path="/location"  element={<Location />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/rewards"   element={<Rewards />} />
            <Route path="/profile"   element={<Profile />} />
          </Routes>
        </PageTransition>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

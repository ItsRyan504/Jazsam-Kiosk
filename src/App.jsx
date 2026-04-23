import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Location from './pages/Location';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import './index.css';

/* Hides Navbar + Footer on /admin, /login, and 404 routes */
const CHROME_PATHS = new Set(['/', '/about', '/menu', '/location', '/my-orders', '/rewards', '/profile']);

function Layout({ children }) {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith('/admin');
  const showChrome = !isAdmin && CHROME_PATHS.has(loc.pathname);
  return (
    <>
      {showChrome && <Navbar />}
      {children}
      {showChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <OrdersProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <PageTransition>
                <Routes>
                  {/* Customer routes */}
                  <Route path="/"          element={<Home />} />
                  <Route path="/about"     element={<About />} />
                  <Route path="/menu"      element={<Menu />} />
                  <Route path="/location"  element={<Location />} />
                  <Route path="/login"     element={<Login />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/rewards"   element={<Rewards />} />
                  <Route path="/profile"   element={<Profile />} />

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* 404 — catch all unmatched routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </Layout>
          </BrowserRouter>
        </OrdersProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;

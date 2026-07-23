import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar      from './components/Navbar';
import Cart        from './components/Cart';
import LoginModal  from './components/LoginModal';
import OfferBanner from './components/OfferBanner';
import Home        from './pages/Home';
import Categories  from './pages/Categories';
import About       from './pages/About';
import Contact     from './pages/Contact';
import Admin       from './pages/Admin';
import TrackOrder  from './pages/TrackOrder';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './styles/index.css';
import './styles/auth-track.css';

function AppShell() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal />
      <div className="page-wrapper flex flex-col min-h-screen">
        <OfferBanner />
        <Routes>
          <Route path="/"           element={<Home />}       />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about"      element={<About />}      />
          <Route path="/contact"    element={<Contact />}    />
          <Route path="/admin"      element={<Admin />}      />
          <Route path="/track"      element={<TrackOrder />} />
        </Routes>
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-auto">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div>
                <Link to="/" className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#D92D20] rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
                  <span className="font-heading font-bold text-lg tracking-tight text-gray-900">
                    CNC <span className="text-[#D92D20]">Crafts</span>
                  </span>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Leading manufacturer of high-precision CNC art and industrial solutions in India. Quality and precision in every cut.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Quick Links</h5>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><Link to="/" className="hover:text-[#D92D20] transition-colors">Home</Link></li>
                  <li><Link to="/categories" className="hover:text-[#D92D20] transition-colors">Products</Link></li>
                  <li><Link to="/track" className="hover:text-[#D92D20] transition-colors">Track Order</Link></li>
                  <li><Link to="/about" className="hover:text-[#D92D20] transition-colors">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Materials</h5>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><Link to="/categories#acrylic" className="hover:text-[#D92D20] transition-colors">Acrylic Art</Link></li>
                  <li><Link to="/categories#mdf" className="hover:text-[#D92D20] transition-colors">MDF Laser Cut</Link></li>
                  <li><Link to="/categories#acp" className="hover:text-[#D92D20] transition-colors">ACP Signage</Link></li>
                  <li><Link to="/categories#3d" className="hover:text-[#D92D20] transition-colors">3D Printed Items</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h5>
                <p className="text-gray-500 text-sm mb-4">Join 2,000+ makers for early access to new designs.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Your email" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm grow focus:outline-none focus:border-[#D92D20]" />
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Join</button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <div>© 2025 CNC CRAFT & SOLUTIONS. ALL RIGHTS RESERVED.</div>
              <div className="flex items-center gap-8">
                <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

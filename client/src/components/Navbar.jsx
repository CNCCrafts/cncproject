import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',        to: '/'          },
  { label: 'Products',    to: '/categories' },
  { label: 'Track Order', to: '/track'      },
  { label: 'About',       to: '/about'      },
];

export default function Navbar({ onCartOpen }) {
  const { count } = useCart();
  const { user, isAdmin, setLoginOpen, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { 
    setMenuOpen(false); 
    setUserMenuOpen(false); 
  }, [location]);

  const isLoggedIn = !!user || isAdmin;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1126px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#D92D20] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
              CNC <span className="text-[#D92D20]">Crafts</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors py-2 ${location.pathname === link.to ? 'text-[#D92D20]' : 'hover:text-[#D92D20]'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 gap-2">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search crafts..." 
              className="bg-transparent border-none outline-none text-sm w-40"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button 
              className="relative p-2 text-gray-600 hover:text-[#D92D20] transition-colors" 
              onClick={onCartOpen}
              aria-label="Open cart"
            >
              <ShoppingBag size={24} />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-[#D92D20] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User size={16} />
                  <span className="hidden sm:inline">{isAdmin ? 'Admin' : user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 z-50">
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <button 
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={logout}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="group relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 overflow-hidden shadow-lg shadow-[#D92D20]/20 hover:shadow-xl hover:shadow-[#D92D20]/30 active:scale-95"
                onClick={() => setLoginOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #D92D20 0%, #B42318 100%)',
                }}
              >
                {/* Shimmer overlay */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {/* Ring glow */}
                <span className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
                {/* Icon */}
                <span className="relative z-10 flex items-center justify-center w-5 h-5">
                  <User size={16} className="text-white/90 group-hover:text-white transition-colors" />
                </span>
                {/* Text */}
                <span className="relative z-10 text-white/95 group-hover:text-white tracking-wide">Login</span>
                {/* Arrow indicator */}
                <span className="relative z-10 flex items-center justify-center w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white/70 group-hover:text-white">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button 
              className="md:hidden p-2 text-gray-600" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 px-6 flex flex-col gap-5 shadow-inner">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`text-base font-semibold ${location.pathname === link.to ? 'text-[#D92D20]' : 'text-gray-700'}`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-base font-semibold text-gray-700">Admin Panel</Link>
          )}
          <hr className="border-gray-100" />
          {!isLoggedIn ? (
            <button className="text-base font-semibold text-[#D92D20] text-left" onClick={() => setLoginOpen(true)}>
              Login / Sign Up
            </button>
          ) : (
            <button className="text-base font-semibold text-red-600 text-left" onClick={logout}>
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

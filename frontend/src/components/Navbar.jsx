import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, search, setSearch } = useCart();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = user?.role;

  // Automatically close mobile menu and dropdowns when the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 🌾 LOGO */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🌾</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 tracking-tight hidden sm:block">
              Farmer Market
            </span>
          </Link>

          {/* 🔎 DESKTOP SEARCH BAR */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors z-10 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search fresh organic products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100/80 hover:bg-gray-100 border border-transparent rounded-full text-sm font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-300 shadow-inner"
            />
          </div>

          {/* 💻 DESKTOP MENU ITEMS */}
          <div className="hidden lg:flex items-center gap-2">
            
            <Link to="/" className="px-4 py-2 rounded-full font-bold text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors">
              Home
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard" className="px-4 py-2 rounded-full font-bold text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/wishlist" className="px-4 py-2 rounded-full font-bold text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-1.5">
                  ❤️ Wishlist
                </Link>
              </>
            )}

            {/* AI CROP DOCTOR */}
            <Link to="/doctor" className="ml-2 flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-5 py-2 rounded-full font-bold hover:bg-emerald-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm">
              ✨ AI Doctor
            </Link>

            {/* ROLE BASED LINKS */}
            {role === "farmer" && (
              <Link to="/add-product" className="ml-2 text-green-700 bg-green-50 border border-green-200 px-5 py-2 rounded-full font-bold hover:bg-green-100 transition-all">
                📦 Sell Produce
              </Link>
            )}

            {role === "admin" && (
              <Link to="/admin" className="ml-2 text-purple-700 bg-purple-50 border border-purple-200 px-5 py-2 rounded-full font-bold hover:bg-purple-100 transition-all">
                ⚙️ Admin Panel
              </Link>
            )}

            {/* CART ICON */}
            <Link to="/cart" className="relative p-2 ml-2 hover:scale-110 transition-transform">
              <span className="text-3xl drop-shadow-sm">🛒</span>
              {cart.length > 0 && (
                <span className="absolute top-0 -right-1 bg-green-500 text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* USER PROFILE & AUTH */}
            <div className="ml-4 pl-4 border-l border-gray-200 relative">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden xl:block">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{role}</p>
                    <p className="text-sm font-black text-gray-800 leading-tight">{user.name}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-50 text-red-600 border border-red-100 px-5 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-600 transition-colors shadow-md active:scale-95"
                  >
                    👤 Account
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-100 rounded-3xl py-3 overflow-hidden transition-all z-50 transform origin-top-right">
                      <div className="px-5 py-2 mb-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Welcome</p>
                      </div>
                      <Link to="/login" className="block px-6 py-3 font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Log In
                      </Link>
                      <Link to="/register" className="block px-6 py-3 font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Create Account
                      </Link>
                      <div className="border-t border-gray-100 my-2 mx-4"></div>
                      <Link to="/admin" className="block px-6 py-3 text-sm font-bold text-purple-600 hover:bg-purple-50 transition-colors">
                        Admin Access
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* 📱 MOBILE MENU BUTTON */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link to="/cart" className="relative p-2">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute top-0 -right-1 bg-green-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cart.length}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* 📱 MOBILE SEARCH BAR (Shows only on mobile) */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
            />
          </div>
        </div>

      </div>

      {/* 📱 MOBILE SLIDE-DOWN MENU */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-white border-b border-gray-200 ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col shadow-inner">
          
          <Link to="/" className="px-4 py-3 font-bold text-gray-700 hover:bg-green-50 rounded-xl">Home</Link>
          
          {user && (
            <>
              <Link to="/dashboard" className="px-4 py-3 font-bold text-gray-700 hover:bg-green-50 rounded-xl">Dashboard</Link>
              <Link to="/wishlist" className="px-4 py-3 font-bold text-gray-700 hover:bg-red-50 rounded-xl">❤️ Wishlist</Link>
            </>
          )}

          <Link to="/doctor" className="px-4 py-3 font-bold text-emerald-700 bg-emerald-50 rounded-xl">✨ AI Doctor</Link>

          {role === "farmer" && (
            <Link to="/add-product" className="px-4 py-3 font-bold text-green-700 bg-green-50 rounded-xl">📦 Sell Produce</Link>
          )}

          {role === "admin" && (
            <Link to="/admin" className="px-4 py-3 font-bold text-purple-700 bg-purple-50 rounded-xl">⚙️ Admin Panel</Link>
          )}

          <div className="border-t border-gray-100 my-2"></div>

          {user ? (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-500 mb-2">Signed in as <span className="font-bold text-gray-900">{user.name}</span></p>
              <button onClick={logout} className="w-full text-left font-bold text-red-600 py-2">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-3 font-bold text-gray-700 hover:bg-green-50 rounded-xl">Log In</Link>
              <Link to="/register" className="px-4 py-3 font-bold text-gray-700 hover:bg-green-50 rounded-xl">Create Account</Link>
            </>
          )}
        </div>
      </div>

    </nav>
  );
}
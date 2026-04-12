import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/Addproduct";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import CropDoctor from "./pages/CropDoctor"; // ✅ IMPORTED NEW AI PAGE

function Navbar() {

  // ✅ FIX: removed role + setRole (Kept your logic)
  const { cart, setSearch, search } = useCart();
  const { user, logout } = useAuth();

  // ✅ correct role
  const role = user?.role;

  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm px-6 py-3 flex justify-between items-center transition-all">

      {/* LOGO */}
      <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 hover:scale-105 transition-transform tracking-tight">
        🌾 Farmer Market
      </Link>

      {/* 🔎 SEARCH */}
      <div className="hidden md:block w-1/3 relative group">
        <input
          type="text"
          placeholder="Search fresh products..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
          🔍
        </span>
      </div>

      {/* MENU */}
      <div className="flex items-center gap-5 font-semibold text-gray-600 text-sm">

        <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
        
        {user && (
          <>
            <Link to="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
            <Link to="/wishlist" className="hover:text-red-500 transition-colors flex items-center gap-1">❤️ Wishlist</Link>
          </>
        )}

        {/* ✅ AI CROP DOCTOR (New Premium Button) */}
        <Link to="/doctor" className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full hover:bg-emerald-100 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
          ✨ AI Doctor
        </Link>

        {/* ✅ FARMER */}
        {role === "farmer" && (
          <Link to="/add-product" className="text-green-600 hover:text-green-700 flex items-center gap-1">
            📦 Add Product
          </Link>
        )}

        {/* ✅ ADMIN (ADDED) */}
        {role === "admin" && (
          <Link to="/admin" className="text-purple-600 hover:text-purple-700">
            Admin
          </Link>
        )}

        {/* USER INFO & DROPDOWN */}
        {user ? (
          <div className="flex items-center gap-3 ml-2 border-l border-gray-200 pl-4">
            <span className="text-gray-800 bg-gray-100 px-3 py-1.5 rounded-full">
              Hi, <span className="font-bold">{user.name}</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="relative ml-2 border-l border-gray-200 pl-4">
            <button 
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-xl"
            >
              👤
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-md shadow-xl border border-gray-100 rounded-2xl py-2 overflow-hidden z-50">
                <Link onClick={() => setOpen(false)} to="/login" className="block px-5 py-3 hover:bg-green-50 hover:text-green-600 transition-colors">
                  Login
                </Link>
                <Link onClick={() => setOpen(false)} to="/register" className="block px-5 py-3 hover:bg-green-50 hover:text-green-600 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}

        {/* CART ICON */}
        <Link to="/cart" className="relative hover:scale-110 transition-transform ml-2 text-2xl">
          🛒
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white">
            {cart.length}
          </span>
        </Link>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/doctor" element={<CropDoctor />} /> {/* ✅ ADDED AI ROUTE */}
      </Routes>

    </BrowserRouter>
  );
}
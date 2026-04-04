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

function Navbar() {

  // ✅ FIX: removed role + setRole
  const { cart, setSearch, search } = useCart();
  const { user, logout } = useAuth();

  // ✅ correct role
  const role = user?.role;

  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow px-6 py-3 flex justify-between items-center">

      {/* LOGO */}
      <h1 className="text-xl font-bold text-green-600">🌾 Farmer Market</h1>

      {/* 🔎 SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-1/3 px-4 py-2 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* MENU */}
      <div className="flex items-center gap-6 font-medium">

        <Link to="/" className="hover:text-green-600">Home</Link>
        <Link to="/cart" className="hover:text-green-600">Cart</Link>
        <Link to="/dashboard" className="hover:text-green-600">Dashboard</Link>
        <Link to="/wishlist" className="hover:text-red-500">❤️ Wishlist</Link>

        {/* ✅ FARMER */}
        {role === "farmer" && (
          <Link to="/add-product" className="text-green-600 font-bold">
            Add Product
          </Link>
        )}

        {/* ✅ ADMIN (ADDED) */}
        {role === "admin" && (
          <Link to="/admin" className="text-blue-600 font-bold">
            Admin
          </Link>
        )}

        {/* USER DROPDOWN */}
        <div className="relative">
          <button onClick={() => setOpen(!open)}>👤</button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded p-2">
              <Link to="/login" className="block px-3 py-2 hover:bg-gray-100">
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 hover:bg-gray-100">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* USER INFO */}
        {user && (
          <>
            <span>Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded ml-3"
            >
              Logout
            </button>
          </>
        )}

        {/* CART ICON */}
        <Link to="/cart" className="relative">
          🛒
          <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs px-2 rounded-full">
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
      </Routes>

    </BrowserRouter>
  );
}
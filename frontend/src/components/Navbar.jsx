import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-green-700">
        🌾 Farmer Market
      </h1>

      <div className="flex gap-6 items-center text-sm font-medium">
        <Link to="/" className="hover:text-green-600">Home</Link>

        {user && (
          <Link to="/cart" className="hover:text-green-600">
            Cart ({cart.length})
          </Link>
        )}

        {user?.role === "farmer" && (
          <Link to="/add-product" className="hover:text-green-600">
            Sell
          </Link>
        )}

        {user ? (
          <>
            <span className="text-gray-600">Hi, {user.name}</span>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-green-600">Register</Link>
            <Link to="/admin" className="text-purple-600">Admin</Link>
          </>
        )}
      </div>
    </div>
  );
}
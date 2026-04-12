import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://farmer-backend-r490.onrender.com/orders")
      .then((res) => res.json())
      .then((data) => {
        // Sort orders so newest are at the top (assuming higher ID = newer)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setOrders(sortedData);
      })
      .catch((err) => console.error("Failed to fetch orders:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Instant UI update function (No more page reloading!)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://farmer-backend-r490.onrender.com/update-status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update the state instantly so the UI reflects the change without a refresh
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        // Optional: you can show a small toast/alert here if you want
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while updating status.");
    }
  };

  // Helper function for beautiful color-coded badges
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "delivered") return "bg-green-100 text-green-700 border-green-200";
    if (s === "shipped") return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-blue-100 text-blue-700 border-blue-200"; // Default: Placed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* 🏷️ Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-800 flex justify-center md:justify-start items-center gap-3">
            📦 Order History
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Track your recent purchases and deliveries.</p>
        </div>

        {/* ⏳ Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : orders.length === 0 ? (
          
          /* 📭 Empty State */
          <div className="bg-white/50 backdrop-blur-md border-2 border-dashed border-gray-300 rounded-[3rem] p-16 md:p-24 text-center shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-600">No orders found</h2>
            <p className="text-gray-500 mt-2 mb-6">Looks like you haven't bought anything yet.</p>
            <button 
              onClick={() => navigate("/")}
              className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
            >
              Start Shopping
            </button>
          </div>

        ) : (
          
          /* 📦 Orders List */
          <div className="space-y-6">
            {orders.map((o) => (
              <div 
                key={o.id} 
                className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                
                {/* Order Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Order #{o.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(o.status)}`}>
                      {o.status || "Placed"}
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-800">
                    ₹ {o.total}
                  </p>
                </div>

                {/* Admin Controls */}
                {user?.role === "admin" && (
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200 w-full md:w-auto">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      Admin Action
                    </label>
                    <select
                      value={o.status || "Placed"}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="w-full md:w-48 px-4 py-2 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all shadow-sm font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
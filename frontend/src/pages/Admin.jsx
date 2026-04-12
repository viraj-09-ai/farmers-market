import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function Admin() {
  const { user } = useAuth();
  const { products, orders, fetchProducts, updateOrderStatus } = useCart();
  const navigate = useNavigate();

  // 🛡️ Premium Unauthorized Screen
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-red-100">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">
            This dashboard is highly classified. Administrator clearance required.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            Return to Market
          </button>
        </div>
      </div>
    );
  }

  // 📊 Stats Calculation
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // 📊 Bar Chart Data
  const chartData = [
    { name: "Products", value: totalProducts },
    { name: "Orders", value: totalOrders },
    { name: "Revenue", value: totalRevenue }
  ];

  // 🟣 Pie Chart Data (Kept your logic)
  const pieData = [
    { name: "Products", value: totalProducts },
    { name: "Orders", value: totalOrders },
    { name: "Revenue", value: totalRevenue }
  ];

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6"]; // Emerald, Blue, Purple

  // Helper for Order Badges
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "delivered") return "bg-green-100 text-green-700 border-green-200";
    if (s === "shipped") return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-blue-100 text-blue-700 border-blue-200"; // Default: Placed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* 🏷️ Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-800 flex justify-center md:justify-start items-center gap-3">
            👨‍💻 Platform Overview
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Monitor sales, inventory, and user activity.</p>
        </div>

        {/* 🔥 STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-8xl opacity-10">📦</div>
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Products</h2>
            <p className="text-5xl font-black text-emerald-600">{totalProducts}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-8xl opacity-10">🛒</div>
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Orders</h2>
            <p className="text-5xl font-black text-blue-600">{totalOrders}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-8xl opacity-10">💰</div>
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Total Revenue</h2>
            <p className="text-5xl font-black text-purple-600">₹ {totalRevenue}</p>
          </div>

        </div>

        {/* 📊 CHARTS SECTION */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* BAR CHART */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              📊 System Overview
            </h2>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              🟣 Data Distribution
            </h2>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* 🟢 PRODUCTS & 🔵 ORDERS (Two Columns on Desktop) */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* PRODUCTS LIST */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">🛒 Inventory</h2>
            
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8 italic">No products in the database.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-red-200 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{p.name}</p>
                      <p className="text-green-600 font-black">₹ {p.price}</p>
                      <p className="text-xs text-gray-400 mt-1">Seller: <span className="font-bold text-gray-600">{p.seller}</span></p>
                    </div>
                    <button
                      onClick={async () => {
                        // Added safety confirmation
                        if(window.confirm(`Are you sure you want to permanently delete ${p.name}?`)) {
                          try {
                            await fetch(`https://farmer-backend-r490.onrender.com/delete-product/${p.id}`, { method: "DELETE" });
                            await fetchProducts();
                          } catch (err) {
                            alert("Failed to delete product.");
                          }
                        }
                      }}
                      className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ORDERS LIST */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">📦 Order Management</h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8 italic">No orders placed yet.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {/* Sorted so newest orders appear at the top */}
                {[...orders].sort((a,b) => b.id - a.id).map((o) => (
                  <div key={o.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order #{o.id}</p>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(o.status)}`}>
                          {o.status || "Placed"}
                        </span>
                      </div>
                      <p className="text-xl font-black text-gray-800">₹ {o.total}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">User: {o.user || "Guest"}</p>
                    </div>
                    <button
                      onClick={() => updateOrderStatus(o.id)}
                      className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-600 transition-colors whitespace-nowrap text-sm"
                    >
                      Bump Status ↗
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
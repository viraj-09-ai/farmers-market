import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
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

  const role = user?.role;

  if (role !== "admin") {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        ❌ Access Denied (Admin Only)
      </div>
    );
  }

  // 📊 stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // 📊 bar chart data
  const chartData = [
    { name: "Products", value: totalProducts },
    { name: "Orders", value: totalOrders },
    { name: "Revenue", value: totalRevenue }
  ];

  // 🟣 pie chart data
  const pieData = [
    { name: "Products", value: totalProducts },
    { name: "Orders", value: totalOrders },
    { name: "Revenue", value: totalRevenue }
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#a855f7"];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      <h1 className="text-4xl font-bold mb-10 text-center animate-pulse">
        👨‍💻 Admin Dashboard
      </h1>

      {/* 🔥 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2>Total Products</h2>
          <p className="text-3xl font-bold text-green-600">{totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2>Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center hover:scale-105 transition">
          <h2>Revenue</h2>
          <p className="text-3xl font-bold text-purple-600">₹ {totalRevenue}</p>
        </div>

      </div>

      {/* 📊 CHARTS SECTION */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-xl font-bold mb-4 text-center">
            📊 Overview Chart
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-xl font-bold mb-4 text-center">
            🟣 Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 🟢 PRODUCTS */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">🛒 Products</h2>

        {products.length === 0 ? (
          <p>No products</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:scale-105 transition"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-green-600">₹ {p.price}</p>
                  <p className="text-sm text-gray-500">Seller: {p.seller}</p>
                  {p.category && <p className="text-sm text-gray-500">Category: {p.category}</p>}
                  {p.quality && <p className="text-sm text-gray-500">Quality: {p.quality}</p>}
                </div>

                <button
                 onClick={async () => {
  await fetch(`http://127.0.0.1:5000/delete-product/${p.id}`, {
    method: "DELETE"
  });

  alert("Deleted ✅");

  await fetchProducts();
}}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔵 ORDERS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Orders</h2>

        {orders.length === 0 ? (
          <p>No orders</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-xl shadow hover:scale-105 transition"
              >
                <p><b>Order ID:</b> {o.id}</p>
                <p><b>Total:</b> ₹ {o.total}</p>
                <p><b>Status:</b> {o.status || "Placed"}</p>
                <button
                  onClick={() => updateOrderStatus(o.id)}
                  className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Update Status
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
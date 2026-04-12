import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { products, deleteProduct, updateProduct } = useCart();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "" });

  // 🛡️ Premium Unauthorized Screen
  if (!user || user.role !== "farmer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-red-100">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">
            This dashboard is restricted to registered Farmers only.
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

  // Filter products by the logged-in farmer
  const myProducts = products.filter(
    (p) => p.seller === (user?.name || "Farmer")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* 🏷️ Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-black text-gray-800 flex items-center justify-center md:justify-start gap-3">
              👨‍🌾 Farmer Dashboard
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Manage your inventory and track your farm's produce.
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/add-product")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>+</span> Add New Product
          </button>
        </div>

        {/* 📦 Products Content */}
        {myProducts.length === 0 ? (
          
          /* --- EMPTY STATE --- */
          <div className="bg-white/50 backdrop-blur-md border-2 border-dashed border-gray-300 rounded-[3rem] p-16 md:p-24 text-center shadow-sm">
            <div className="text-6xl mb-4">🌾</div>
            <h2 className="text-2xl font-bold text-gray-600">Your farm is empty</h2>
            <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
              You haven't listed any produce on the market yet. Add your first product to start selling!
            </p>
            <button 
              onClick={() => navigate("/add-product")}
              className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all duration-300"
            >
              Add Product
            </button>
          </div>

        ) : (

          /* --- INVENTORY LIST --- */
          <div className="space-y-5">
            {myProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white/70 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg transition-all duration-300"
              >
                
                {/* ⬅️ LEFT SIDE: Image & Info / Edit Mode */}
                <div className="flex items-center gap-5 w-full md:w-2/3">
                  <img
                    src={product.image ? `https://farmer-backend-r490.onrender.com/uploads/${product.image}` : "https://via.placeholder.com/80?text=Produce"}
                    onError={(e) => e.target.src = "https://via.placeholder.com/80?text=Produce"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-2xl shadow-sm border border-gray-100"
                  />

                  <div className="flex-1 w-full">
                    {editingId === product.id ? (
                      /* ✏️ EDITING MODE */
                      <div className="space-y-2 w-full pr-4">
                        <input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all font-bold text-gray-800"
                          placeholder="Product Name"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-400 font-bold">₹</span>
                          <input
                            type="number"
                            value={editData.price}
                            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition-all font-bold text-green-700"
                            placeholder="Price"
                          />
                        </div>
                      </div>
                    ) : (
                      /* 👁️ VIEW MODE */
                      <>
                        <p className="font-black text-xl text-gray-800 truncate">{product.name}</p>
                        <p className="text-gray-400 text-sm italic mb-1">{product.category || "Fresh Produce"}</p>
                        <p className="text-green-600 font-black text-lg">
                          ₹ {product.price}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* ➡️ RIGHT SIDE: Actions */}
                <div className="flex w-full md:w-auto gap-2 mt-2 md:mt-0">
                  {editingId === product.id ? (
                    /* SAVE BUTTON */
                    <button
                      onClick={() => {
                        if (!editData.name || !editData.price) {
                          alert("Name and Price cannot be empty!");
                          return;
                        }
                        updateProduct({
                          ...product,
                          name: editData.name,
                          price: Number(editData.price)
                        });
                        setEditingId(null);
                      }}
                      className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Save
                    </button>
                  ) : (
                    /* EDIT BUTTON */
                    <button
                      onClick={() => {
                        setEditingId(product.id);
                        setEditData({ name: product.name, price: product.price });
                      }}
                      className="flex-1 md:flex-none bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-bold px-5 py-2.5 rounded-xl transition-all border border-transparent hover:border-blue-200"
                    >
                      Edit
                    </button>
                  )}

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => {
                      if(window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="flex-1 md:flex-none bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-bold px-5 py-2.5 rounded-xl transition-all border border-red-100 hover:shadow-md active:scale-95"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>

        )}

      </div>
    </div>
  );
}
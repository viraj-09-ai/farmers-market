import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { products, deleteProduct, updateProduct } = useCart();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "" });

  if (!user || user.role !== "farmer") {
    return (
      <div className="p-10 text-center text-red-500">
        Access Denied (Only Farmers)
      </div>
    );
  }

  const myProducts = products.filter(
    (p) => p.seller === (user?.name || "Farmer")
  );

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-center">
        👨‍🌾 Farmer Dashboard
      </h1>

      {myProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No products added yet
        </p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">

          {myProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >

              <div className="flex items-center gap-4">

                <img
                  src={product.image ? `http://127.0.0.1:5000/uploads/${product.image}` : "https://via.placeholder.com/64"}
                  onError={(e) => e.target.src = "https://via.placeholder.com/64"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div>

                  {editingId === product.id ? (
                    <>
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="border p-1 mb-1"
                      />
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: e.target.value })
                        }
                        className="border p-1"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg">{product.name}</p>
                      <p className="text-green-600">₹ {product.price}</p>
                    </>
                  )}

                </div>

              </div>

              <div className="flex gap-2">

                {editingId === product.id ? (
                  <button
                    onClick={() => {
                      if (!editData.name || !editData.price) return;

                      updateProduct({
                        ...product,
                        name: editData.name,
                        price: Number(editData.price)
                      });

                      setEditingId(null);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(product.id);
                      setEditData({
                        name: product.name,
                        price: product.price
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
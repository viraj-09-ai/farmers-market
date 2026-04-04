import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function AddProduct() {

  const { user } = useAuth();
  const { fetchProducts } = useCart();

  if (!user || user.role !== "farmer") {
    return <div className="p-10 text-center">Access Denied: Farmers Only</div>;
  }

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quality: ""
  });

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION (KEEP SAME)
    if (!form.name || !form.price || !form.category || !file) {
      alert("Please fill all fields and upload an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("seller", user?.name);
      formData.append("image", file);
      formData.append("category", form.category);
      formData.append("quality", form.quality);

      const res = await fetch("http://127.0.0.1:5000/add-product", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Product Added ✅");

        // refresh product list across app
        await fetchProducts();

        // ✅ RESET FORM (KEEP SAME)
        setForm({
          name: "",
          price: "",
          category: "",
          quality: ""
        });
        setFile(null);
      }

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Name"
          className="w-full p-2 border"
          value={form.name}
          onChange={(e)=>setForm({...form, name:e.target.value})}
        />

        <input
          placeholder="Price"
          type="number"
          className="w-full p-2 border"
          value={form.price}
          onChange={(e)=>setForm({...form, price:e.target.value})}
        />

        <select
          className="w-full p-2 border"
          value={form.category}
          onChange={(e)=>setForm({...form, category:e.target.value})}
        >
          <option value="">Select Category</option>
          <option>Fruit</option>
          <option>Vegetable</option>
          <option>Dairy</option>
          <option>Grains</option>
          <option>Snacks</option>
          <option>Beverages</option>
        </select>

        <select
          className="w-full p-2 border"
          value={form.quality}
          onChange={(e)=>setForm({...form, quality:e.target.value})}
        >
          <option value="">Select Quality</option>
          <option>Organic</option>
          <option>Fresh</option>
          <option>Premium</option>
        </select>

        <input
          type="file"
          className="w-full p-2 border"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />

        <button className="bg-green-500 text-white w-full py-2">
          Add Product
        </button>

      </form>

    </div>
  );
}
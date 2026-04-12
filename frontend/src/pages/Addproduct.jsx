import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const { user } = useAuth();
  const { fetchProducts } = useCart();
  const navigate = useNavigate();

  // 🛡️ Premium Unauthorized Screen
  if (!user || user.role !== "farmer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-red-100">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">
            Only registered Farmers can add produce to the market.
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

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quality: ""
  });

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION (Kept exactly the same)
    if (!form.name || !form.price || !form.category || !file) {
      alert("Please fill all fields and upload an image");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("seller", user?.name);
      formData.append("image", file);
      formData.append("category", form.category);
      formData.append("quality", form.quality);

      const res = await fetch("https://farmer-backend-r490.onrender.com/add-product", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Product Added Successfully!");

        // refresh product list across app
        await fetchProducts();

        // ✅ RESET FORM
        setForm({
          name: "",
          price: "",
          category: "",
          quality: ""
        });
        setFile(null);
        
        // Optional: Redirect back to dashboard after adding
        // navigate("/dashboard"); 
      } else {
        alert("Failed to add product. Please try again.");
      }

    } catch (err) {
      console.error(err);
      alert("Server error. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 p-6 md:p-12">
      
      {/* Glassmorphism Container */}
      <div className="w-full max-w-xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden">
        
        {/* Decorative background blur inside the card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Add Produce 🌾</h2>
            <p className="text-gray-500 mt-2 font-medium">List your fresh harvest on the marketplace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Product Name Input */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Product Name</label>
                <input
                  required
                  placeholder="e.g., Organic Red Apples"
                  className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder-gray-400 shadow-sm font-bold text-gray-800"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Price per unit (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                  <input
                    required
                    placeholder="0.00"
                    type="number"
                    min="1"
                    className="w-full pl-9 pr-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder-gray-400 shadow-sm font-bold text-green-700"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Category</label>
                <select
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all shadow-sm font-medium text-gray-700 cursor-pointer appearance-none"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Fruit">🍎 Fruit</option>
                  <option value="Vegetable">🥦 Vegetable</option>
                  <option value="Dairy">🥛 Dairy</option>
                  <option value="Grains">🌾 Grains</option>
                  <option value="Snacks">🥨 Snacks</option>
                  <option value="Beverages">🧃 Beverages</option>
                </select>
              </div>

              {/* Quality Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Quality Grade</label>
                <select
                  className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all shadow-sm font-medium text-gray-700 cursor-pointer appearance-none"
                  value={form.quality}
                  onChange={(e) => setForm({ ...form, quality: e.target.value })}
                >
                  <option value="" disabled>Select Quality</option>
                  <option value="Organic">🌿 100% Organic</option>
                  <option value="Fresh">✨ Farm Fresh</option>
                  <option value="Premium">⭐ Premium Grade</option>
                </select>
              </div>
            </div>

            {/* Custom File Upload Dropzone */}
            <div className="pt-2">
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Product Image</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${file ? 'border-green-400 bg-green-50/50' : 'border-gray-300 bg-white/50 hover:border-green-400 hover:bg-white/80'}`}>
                
                {/* Invisible input stretched over the div */}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) setFile(selectedFile);
                  }}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-green-200">
                      📸
                    </div>
                    <p className="text-green-700 font-bold truncate max-w-full px-4">{file.name}</p>
                    <p className="text-xs text-green-600/70 font-medium">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-gray-200">
                      ➕
                    </div>
                    <p className="text-gray-600 font-bold">Tap to upload image</p>
                    <p className="text-xs text-gray-400 font-medium">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading to Market...
                </>
              ) : (
                "Publish Product"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
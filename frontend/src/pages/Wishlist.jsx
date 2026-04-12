import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // Added so users can go back to shopping

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  // Bulletproof fallback
  const items = wishlist || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* 🏷️ Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-800 flex justify-center md:justify-start items-center gap-3">
            ❤️ Your Wishlist 
            <span className="text-green-600 text-2xl font-bold bg-green-100 px-3 py-1 rounded-full">
              {items.length}
            </span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Save your favorite fresh produce for later.
          </p>
        </div>

        {/* 📦 Wishlist Content */}
        {items.length === 0 ? (
          /* --- EMPTY STATE --- */
          <div className="bg-white/50 backdrop-blur-md border-2 border-dashed border-gray-300 rounded-[3rem] p-16 md:p-24 text-center shadow-sm">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-600">No favorites yet!</h2>
            <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
              You haven't added any items to your wishlist. Explore our market and find some fresh produce you love.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all duration-300"
            >
              Explore Market
            </button>
          </div>
        ) : (
          /* --- POPULATED LIST --- */
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white/70 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* ⬅️ LEFT SIDE: Image & Details */}
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="relative">
                    <img
                      src={
                        item.image
                          ? `https://farmer-backend-r490.onrender.com/uploads/${item.image}`
                          : "https://via.placeholder.com/150?text=Fresh"
                      }
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-2xl shadow-md border border-gray-100"
                    />
                    {/* Tiny heart badge overlay */}
                    <div className="absolute -top-2 -left-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
                      ❤️
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-xl text-gray-800">{item.name}</p>
                    <p className="text-gray-400 text-sm italic mb-1">{item.category || "Premium Quality"}</p>
                    <p className="text-green-700 font-black text-lg">
                      ₹ {item.price}
                    </p>
                  </div>
                </div>

                {/* ➡️ RIGHT SIDE: Action Buttons */}
                <div className="flex w-full md:w-auto gap-3 mt-4 md:mt-0">
                  
                  {/* Remove Button (Subtle styling) */}
                  <button
                    onClick={() => {
                      toggleWishlist(item);
                      alert(`Removed ${item.name} from wishlist ❌`);
                    }}
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white transition-colors duration-300"
                  >
                    Remove
                  </button>

                  {/* Add to Cart Button (Primary styling) */}
                  <button
                    onClick={() => {
                      addToCart(item);
                      alert(`Added ${item.name} to cart 🛒`);
                    }}
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl font-bold text-white bg-gray-900 border border-gray-800 shadow-lg hover:bg-green-600 hover:border-green-600 hover:shadow-green-200 transition-all duration-300"
                  >
                    Add to Cart
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
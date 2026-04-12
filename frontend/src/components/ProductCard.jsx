import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function ProductCard({ p }) {
  // Destructure wishlist features from your context
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Check if this specific product is already in the wishlist
  const inWishlist = wishlist?.some((item) => item.id === p.id);

  // Function to handle the "Added" animation
  const handleAdd = () => {
    addToCart(p);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500); // Reset button after 1.5s
  };

  // ✅ Updated to point to your LIVE Render backend
  const imageUrl = p.image 
    ? `https://farmer-backend-r490.onrender.com/uploads/${p.image}` 
    : "https://via.placeholder.com/300?text=Fresh+Produce";

  return (
    <div className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
      
      {/* 🖼️ Product Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={p.name}
          onError={(e) => e.target.src = "https://via.placeholder.com/300?text=Produce"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg">
          {p.category || "Fresh"}
        </div>

        {/* ❤️ Wishlist Toggle Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card clicks if you wrap it in a Link later
            toggleWishlist(p);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        >
          {inWishlist ? (
            <span className="text-red-500 text-lg leading-none block">❤️</span>
          ) : (
            <span className="text-gray-400 text-lg leading-none block hover:text-red-400">🤍</span>
          )}
        </button>
      </div>

      {/* 📄 Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-800 truncate" title={p.name}>{p.name}</h2>
          <p className="text-gray-500 text-xs font-medium mt-1">
            Seller: <span className="text-green-700">{p.seller || "Local Farm"}</span>
          </p>
        </div>

        {/* Quality Rating (Visual Polish) */}
        <div className="flex items-center mb-4 text-yellow-500 text-xs">
          {"★★★★★".split("").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
          <span className="text-gray-400 ml-2 font-bold uppercase tracking-wider text-[10px] bg-gray-100 px-2 py-0.5 rounded-md">
            {p.quality || "Premium"}
          </span>
        </div>

        {/* Price & Cart Actions */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] font-bold line-through decoration-red-400">
              ₹{Math.round(p.price * 1.15)}
            </span>
            <span className="text-2xl font-black text-green-700">
              ₹{p.price}
            </span>
          </div>

          {/* 🛒 Interactive Add Button */}
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
              isAdded 
              ? "bg-gray-800 text-white cursor-default shadow-md" 
              : "bg-green-600 text-white shadow-lg shadow-green-600/30 hover:bg-green-700"
            }`}
          >
            {isAdded ? (
              <>
                <svg className="w-5 h-5 animate-bounce text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <span className="text-lg leading-none">+</span> Add
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
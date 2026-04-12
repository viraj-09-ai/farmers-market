import { useState, useRef } from "react";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { addToCart, toggleWishlist, wishlist, addRating, ratings, search, products } = useCart();
  const [filter, setFilter] = useState("All");
  
  const [maxPrice, setMaxPrice] = useState(10000); 
  const [quality, setQuality] = useState([]);

  // Reference for smooth scrolling
  const shopSectionRef = useRef(null);

  const scrollToShop = () => {
    shopSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ FILTER LOGIC (Kept exactly the same)
  const filtered = products.filter((p) => {
    const categoryMatch =
      filter === "All" ||
      (p.category &&
        p.category.toLowerCase() === filter.toLowerCase());

    const priceMatch = p.price <= maxPrice;

    const qualityMatch =
      quality.length === 0 ||
      (p.quality && quality.includes(p.quality));

    const searchMatch =
      p.name &&
      p.name.toLowerCase().includes((search || "").toLowerCase());

    return categoryMatch && priceMatch && qualityMatch && searchMatch;
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-100 min-h-screen pb-10 font-sans text-gray-800">

      {/* 🌟 HERO SECTION */}
      <div className="px-4 sm:px-10 pt-6 max-w-[1600px] mx-auto">
        <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 text-white p-16 sm:p-24 text-center rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
          
          <h1 className="relative z-10 text-5xl sm:text-7xl font-black tracking-tight drop-shadow-lg mb-4">
            Fresh From Farmers 🌾
          </h1>
          <p className="relative z-10 mt-4 text-xl sm:text-2xl font-medium text-green-100 max-w-2xl mx-auto">
            100% Organic • Affordable • Fast Delivery right to your doorstep.
          </p>
          <button 
            onClick={scrollToShop}
            className="relative z-10 mt-10 bg-white text-green-700 px-10 py-4 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            Start Shopping
          </button>
        </section>
      </div>

      {/* 🚀 FEATURES */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 sm:px-10 max-w-[1600px] mx-auto text-center mt-8">
        {[
          { icon: "🚜", title: "Direct Farmers" },
          { icon: "⚡", title: "Fast Delivery" },
          { icon: "🌱", title: "100% Organic" },
          { icon: "💰", title: "Best Prices" }
        ].map((feat, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-4xl mb-3">{feat.icon}</div>
            <h3 className="font-bold text-lg text-gray-800">{feat.title}</h3>
          </div>
        ))}
      </section>

      {/* 📁 CATEGORY QUICK LINKS (Now Functional!) */}
      <section className="px-4 sm:px-10 max-w-[1600px] mx-auto mt-16">
        <h2 className="text-3xl font-black text-center mb-8 tracking-tight text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {["Fruit","Vegetable","Dairy","Grains","Snacks"].map(cat => (
            <button 
              key={cat} 
              onClick={() => {
                setFilter(cat);
                scrollToShop();
              }}
              className={`p-6 rounded-[2rem] shadow-sm border transition-all duration-300 font-bold text-lg flex flex-col items-center justify-center gap-2 active:scale-95 ${
                filter === cat 
                ? "bg-green-600 text-white border-green-500 shadow-green-500/30 shadow-lg" 
                : "bg-white/80 border-gray-100 text-gray-700 hover:bg-green-50 hover:border-green-200 hover:-translate-y-1"
              }`}
            >
              {cat === "Fruit" && "🍎"}
              {cat === "Vegetable" && "🥦"}
              {cat === "Dairy" && "🥛"}
              {cat === "Grains" && "🌾"}
              {cat === "Snacks" && "🥨"}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 🎉 OFFER BANNER */}
      <div className="px-4 sm:px-10 max-w-[1600px] mx-auto mt-16">
        <section className="bg-gray-900 text-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="text-left mb-6 md:mb-0 relative z-10">
            <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Get 20% OFF 🎉
            </h2>
            <p className="text-lg text-gray-300 font-medium">Exclusive discount on your first farm-fresh order.</p>
          </div>
          <div className="relative z-10 bg-black/40 backdrop-blur-md border border-white/10 px-10 py-5 rounded-3xl font-mono text-3xl font-black tracking-widest shadow-inner cursor-pointer hover:bg-black/60 transition-colors" title="Click to copy">
            FARM20
          </div>
        </section>
      </div>

      {/* 🛍️ MAIN SHOP SECTION */}
      <div ref={shopSectionRef} className="flex flex-col lg:flex-row px-4 sm:px-10 mt-16 gap-10 max-w-[1600px] mx-auto scroll-mt-10">

        {/* 🎛️ SIDEBAR FILTERS */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="bg-white/70 backdrop-blur-xl p-8 shadow-xl shadow-gray-200/50 rounded-[2.5rem] border border-white/80 sticky top-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Filters</h2>
              {(filter !== "All" || maxPrice !== 10000 || quality.length > 0) && (
                <button 
                  onClick={() => { setFilter("All"); setMaxPrice(10000); setQuality([]); }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Categories</h3>
              <div className="space-y-1">
                {["All","Fruit","Vegetable","Dairy","Grains","Snacks","Beverages"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`w-full text-left px-5 py-3 rounded-2xl font-bold transition-all duration-200 ${
                      filter === cat ? "bg-green-500 text-white shadow-md shadow-green-500/20" : "bg-transparent text-gray-600 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-200/50" />

            {/* SUB CATEGORY / QUALITY */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Quality Grade</h3>
              <div className="space-y-3">
                {["Organic", "Fresh", "Premium"].map((q) => (
                  <label key={q} className="flex items-center space-x-4 cursor-pointer group p-2 hover:bg-white rounded-xl transition-colors">
                    <input
                      type="checkbox"
                      value={q}
                      checked={quality.includes(q)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors cursor-pointer"
                      onChange={(e) => {
                        if (e.target.checked) setQuality([...quality, q]);
                        else setQuality(quality.filter(item => item !== q));
                      }}
                    /> 
                    <span className="font-bold text-gray-700 group-hover:text-green-700 transition-colors">{q}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-200/50" />

            {/* PRICE */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs mb-4">Max Price</h3>
              <input
                type="range"
                min="0"
                max="10000"
                className="w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-black text-gray-400">₹0</span>
                <span className="text-sm font-black text-green-700 bg-green-100 px-4 py-1.5 rounded-xl">₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 📦 PRODUCTS GRID */}
        <div className="flex-1">
          
          <div className="flex justify-between items-end mb-8 px-2">
            <h2 className="text-2xl font-black text-gray-800">
              {filter === "All" ? "All Products" : filter} 
              <span className="text-gray-400 text-lg ml-2 font-medium">({filtered.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map(item => {
              const inWishlist = wishlist.find(w => w.id === item.id);
              return (
                <div key={item.id} className="group bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden relative">

                  {/* Absolute Floating Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-10 flex items-center justify-center"
                  >
                    {inWishlist ? <span className="text-red-500 text-lg block leading-none">❤️</span> : <span className="text-gray-400 text-lg block leading-none hover:text-red-400">🤍</span>}
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                    {item.category || "Fresh"}
                  </div>

                  {/* Product Image */}
                  <div className="overflow-hidden bg-gray-100 h-56 relative">
                    <img 
                      src={item.image ? `https://farmer-backend-r490.onrender.com/uploads/${item.image}` : "https://via.placeholder.com/400x300?text=No+Image"}
                      onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-black text-xl text-gray-900 line-clamp-1 mb-1" title={item.name}>{item.name}</h2>
                    <p className="text-xs font-bold text-gray-400 mb-4">By <span className="text-green-700">{item.seller || "Local Farm"}</span></p>

                    {/* Ratings Section */}
                    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl mb-auto">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avg = ratings[item.id] ? ratings[item.id].reduce((a, b) => a + b, 0) / ratings[item.id].length : 0;
                          return (
                            <span
                              key={star}
                              onClick={() => addRating(item.id, star)}
                              className={`cursor-pointer text-xl transition-all hover:scale-125 ${star <= avg ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm">
                        {ratings[item.id] ? (ratings[item.id].reduce((a, b) => a + b, 0) / ratings[item.id].length).toFixed(1) : "New"}
                      </span>
                    </div>

                    {/* Price & Action */}
                    <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 line-through decoration-red-400 mb-0.5">₹{Math.round(item.price * 1.2)}</p>
                        <p className="font-black text-3xl text-green-700 leading-none">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gray-900 text-white font-black px-6 py-3 rounded-xl hover:bg-green-600 shadow-lg shadow-gray-900/20 hover:shadow-green-600/30 transition-all duration-300 active:scale-95"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-32 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-gray-300">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-black text-gray-700">No products found.</h3>
                <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or search term.</p>
                <button onClick={() => { setFilter("All"); setMaxPrice(10000); setQuality([]); }} className="mt-6 bg-green-100 text-green-700 px-6 py-2 rounded-xl font-bold hover:bg-green-200 transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💌 NEWSLETTER */}
      <div className="px-4 sm:px-10 max-w-[1600px] mx-auto mt-24 mb-10">
        <section className="bg-gray-900 text-white text-center p-12 sm:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
          
          <h2 className="relative z-10 text-4xl font-black mb-4 tracking-tight">Stay Fresh, Stay Updated</h2>
          <p className="relative z-10 text-gray-400 mb-10 font-medium">Subscribe to our newsletter for seasonal deals and new arrivals.</p>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-3">
            <input className="w-full px-6 py-4 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-inner bg-white/90 backdrop-blur-sm" placeholder="Enter email address"/>
            <button className="bg-green-500 text-white px-10 py-4 rounded-2xl font-black hover:bg-green-400 transition-all shadow-lg shadow-green-500/30 active:scale-95 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>
      </div>

      {/* 🏁 FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-10 py-16 text-gray-600 mt-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h2 className="text-2xl font-black text-green-700 mb-4 tracking-tight flex items-center gap-2">🌾 Farmer Market</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Delivering the freshest organic produce directly from local farms to your kitchen.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">Quick Links</h3>
            <div className="space-y-4 font-bold text-sm">
              <p className="hover:text-green-600 cursor-pointer transition-colors w-fit">Home</p>
              <p className="hover:text-green-600 cursor-pointer transition-colors w-fit">Products</p>
              <p className="hover:text-green-600 cursor-pointer transition-colors w-fit">Cart</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">Categories</h3>
            <div className="space-y-4 font-bold text-sm">
              <p onClick={() => {setFilter("Fruit"); scrollToShop()}} className="hover:text-green-600 cursor-pointer transition-colors w-fit">Fruits</p>
              <p onClick={() => {setFilter("Vegetable"); scrollToShop()}} className="hover:text-green-600 cursor-pointer transition-colors w-fit">Vegetables</p>
              <p onClick={() => {setFilter("Dairy"); scrollToShop()}} className="hover:text-green-600 cursor-pointer transition-colors w-fit">Dairy</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">Contact Us</h3>
            <div className="space-y-4 font-bold text-sm">
              <p className="flex items-center gap-3"><span className="text-xl">✉️</span> support@farm.com</p>
              <p className="flex items-center gap-3"><span className="text-xl">📞</span> +91 99999 99999</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
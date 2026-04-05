import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { addToCart, toggleWishlist, wishlist, addRating, ratings, search, products } = useCart();
  const [filter, setFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [quality, setQuality] = useState([]);
  

  
  

  // ✅ FIXED FILTER (STEP 3 COMPLETE)
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
      p.name.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && priceMatch && qualityMatch && searchMatch;
  });

  return (
    <div className="bg-gray-100">

      {/* HERO */}
      <section className="bg-gradient-to-r from-green-700 to-green-400 text-white p-20 text-center">
        <h1 className="text-5xl font-bold">🌾 Fresh From Farmers</h1>
        <p className="mt-4 text-lg">Organic • Affordable • Fast Delivery</p>
        <button className="mt-6 bg-white text-green-600 px-6 py-2 rounded font-bold hover:scale-105 transition">
          Shop Now
        </button>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-4 gap-6 p-10 text-center">
        <div className="bg-white p-6 rounded shadow hover:-translate-y-2 transition">🚜 Direct Farmers</div>
        <div className="bg-white p-6 rounded shadow hover:-translate-y-2 transition">⚡ Fast Delivery</div>
        <div className="bg-white p-6 rounded shadow hover:-translate-y-2 transition">🌱 Organic</div>
        <div className="bg-white p-6 rounded shadow hover:-translate-y-2 transition">💰 Best Price</div>
      </section>

      {/* CATEGORY */}
      <section className="p-10">
        <h2 className="text-3xl font-bold text-center mb-6">Shop by Category</h2>
        <div className="grid md:grid-cols-5 gap-6">
          {["Fruits","Vegetables","Dairy","Grains","Snacks"].map(cat => (
            <div key={cat} className="bg-white p-6 rounded shadow text-center hover:shadow-xl transition cursor-pointer">
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section className="bg-green-500 text-white text-center p-10 mx-10 rounded-xl">
        <h2 className="text-2xl font-bold">Get 20% OFF 🎉</h2>
        <p>Use code: FARM20</p>
      </section>

      {/* MAIN */}
      <div className="flex">

        {/* SIDEBAR */}
        <div className="w-80 bg-white p-5 shadow-lg min-h-screen sticky top-0 overflow-y-auto">

          <h2 className="text-2xl font-bold mb-4">Filters</h2>

          {/* CATEGORY */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Categories</h3>
            {["All","Fruit","Vegetable","Dairy","Grains","Snacks","Beverages"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`w-full text-left px-3 py-2 mb-2 rounded transition ${
                  filter === cat ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <hr className="my-4" />

          {/* SUB CATEGORY */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Sub Categories</h3>
            {["Organic", "Fresh", "Premium"].map((q) => (
              <label key={q} className="block text-sm">
                <input
                  type="checkbox"
                  value={q}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQuality([...quality, q]);
                    } else {
                      setQuality(quality.filter(item => item !== q));
                    }
                  }}
                /> {q}
              </label>
            ))}
          </div>

          <hr className="my-4" />

          {/* PRICE */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <input
              type="range"
              min="0"
              max="100000"
              className="w-full"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>₹0</span>
              <span>₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          <hr className="my-4" />

          {/* QUALITY */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quality</h3>
            <label className="block text-sm"><input type="checkbox" /> Organic</label>
            <label className="block text-sm"><input type="checkbox" /> Fresh</label>
            <label className="block text-sm"><input type="checkbox" /> Premium</label>
          </div>

          <hr className="my-4" />

          {/* DELIVERY */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Delivery</h3>
            <label className="block text-sm"><input type="checkbox" /> Same Day</label>
            <label className="block text-sm"><input type="checkbox" /> Free Delivery</label>
          </div>

          <hr className="my-4" />

          {/* SORT */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Sort By</h3>
            <select className="w-full p-2 border rounded">
              <option>Price Low → High</option>
              <option>Price High → Low</option>
              <option>Newest</option>
              <option>Top Rated</option>
            </select>
          </div>

        </div>

        {/* PRODUCTS */}
        <div className="flex-1 p-6 grid md:grid-cols-3 gap-6">

          {filtered.map(item => (
            <div key={item.id} className="bg-white p-4 rounded shadow hover:shadow-xl transition">

              <img 
                src={item.image ? `https://farmer-backend-r490.onrender.com/uploads/${item.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
                onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=No+Image"}
                alt={item.name}
                className="h-40 w-full object-cover rounded"/>

              <h2 className="font-bold mt-2">{item.name}</h2>
              <p className="text-green-600 font-bold">₹ {item.price}</p>
              <div className="mt-2">
  <div className="mt-2">
  {[1, 2, 3, 4, 5].map((star) => {
    const avg =
      ratings[item.id]
        ? ratings[item.id].reduce((a, b) => a + b, 0) /
          ratings[item.id].length
        : 0;

    return (
      <span
        key={star}
        onClick={() => {
          addRating(item.id, star);
          alert("Rating added ⭐");
        }}
        className={`cursor-pointer text-2xl ${
          star <= avg ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    );
  })}
</div>
</div>
<p className="text-sm text-gray-600">
  Avg Rating:{" "}
  {ratings[item.id]
    ? (
        ratings[item.id].reduce((a, b) => a + b, 0) /
        ratings[item.id].length
      ).toFixed(1)
    : "No ratings"}
</p>

              <button
                onClick={() => addToCart(item)}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded"
              >
                Add to Cart
              </button>
              <button
  onClick={() => {
    const exists = wishlist.find(w => w.id === item.id);

    toggleWishlist(item);

    if (exists) {
      alert("Removed from wishlist ❌");
    } else {
      alert("Added to wishlist ❤️");
    }
  }}
  className="mt-2 text-2xl"
>
  {wishlist.find(w => w.id === item.id) ? "❤️" : "🤍"}
</button>
              

               

            </div>
          ))}

        </div>

      </div>

      {/* TESTIMONIALS */}
      <section className="p-10 bg-white mt-10">
        <h2 className="text-3xl font-bold text-center mb-6">What Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="shadow p-4 rounded">"Very fresh products!" ⭐⭐⭐⭐⭐</div>
          <div className="shadow p-4 rounded">"Fast delivery!" ⭐⭐⭐⭐⭐</div>
          <div className="shadow p-4 rounded">"Best prices!" ⭐⭐⭐⭐</div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-green-600 text-white text-center p-10">
        <h2 className="text-2xl font-bold">Subscribe for Updates</h2>
        <input className="mt-4 p-2 rounded text-black" placeholder="Enter email"/>
        <br/>
        <button className="mt-3 bg-white text-green-600 px-4 py-2 rounded">
          Subscribe
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white p-10 grid md:grid-cols-4 gap-6">
        <div>
          <h2 className="text-xl font-bold">🌾 Farmer Market</h2>
          <p className="text-gray-400 mt-2">Fresh products directly from farmers</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <p>Home</p>
          <p>Products</p>
          <p>Cart</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Categories</h3>
          <p>Fruits</p>
          <p>Vegetables</p>
          <p>Dairy</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p>Email: support@farm.com</p>
          <p>Phone: +91 99999 99999</p>
        </div>
      </footer>

    </div>
  );
}
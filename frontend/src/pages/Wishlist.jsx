import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const items = wishlist || [];

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-center">
        ❤️ Your Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          No items in wishlist
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <img
                  src={item.image ? `http://127.0.0.1:5000/uploads/${item.image}` : "https://via.placeholder.com/80"}
                  className="w-16 h-16 object-cover rounded"
                />

                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-green-600 font-semibold">
                    ₹ {item.price}
                  </p>
                </div>

              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex gap-3">

                {/* ADD TO CART */}
                <button
                  onClick={() => {
                    addToCart(item);
                    alert("Added to cart 🛒");
                  }}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>

                {/* REMOVE */}
                <button
                  onClick={() => {
                    toggleWishlist(item);
                    alert("Removed from wishlist ❌");
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
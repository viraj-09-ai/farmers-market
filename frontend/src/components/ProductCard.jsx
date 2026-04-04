import { useCart } from "../context/CartContext";

export default function ProductCard({ p }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition">
      <h2 className="text-lg font-semibold">{p.name}</h2>

      <p className="text-gray-500 text-sm">{p.category}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-bold text-lg">
          ₹ {p.price}
        </span>

        <button
          onClick={() => addToCart(p)}
          className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
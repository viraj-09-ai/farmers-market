import { motion } from "framer-motion";

export default function ProductCard({ p }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition"
    >
      <img
        src={p.image}
        alt={p.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h2 className="text-sm font-semibold">{p.name}</h2>
        <p className="text-xs text-gray-500">{p.category}</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-green-600 font-bold">
            ₹{p.price}
          </span>

          <button className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

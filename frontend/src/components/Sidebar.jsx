import { useState } from "react";

export default function Sidebar({ setFilter }) {
  const [active, setActive] = useState("");

  const handleClick = (cat) => {
    setActive(cat);
    setFilter(cat);
  };

  const btnClass = (cat) =>
    `py-2 rounded transition ${
      active === cat
        ? "bg-green-700 text-white"
        : "bg-green-500 text-white hover:bg-green-600"
    }`;

  return (
    <div className="w-64 bg-white shadow-lg p-5">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <div className="flex flex-col gap-3">
        <button className={btnClass("")} onClick={() => handleClick("")}>
          All
        </button>
        <button className={btnClass("Vegetables")} onClick={() => handleClick("Vegetables")}>
          Vegetables
        </button>
        <button className={btnClass("Fruits")} onClick={() => handleClick("Fruits")}>
          Fruits
        </button>
        <button className={btnClass("Grains")} onClick={() => handleClick("Grains")}>
          Grains
        </button>
      </div>
    </div>
  );
}